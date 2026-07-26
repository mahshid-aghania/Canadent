#!/usr/bin/env python3
"""Post-process the canadent.net static mirror for local /canadent/ serving."""

from __future__ import annotations

import os
import re
import shutil
import urllib.request
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path("/workspace/canadent")
PREFIX = "/canadent"

TRACKER_PATTERNS = [
    # IMPORTANT: never use DOTALL with patterns that can escape tag boundaries
    re.compile(
        r"<script[^>]*(?:trustedsite|cdn\.ywxi\.net|wsimg\.com|pixel\.wp\.com|stats\.wp\.com|js\.stripe\.com|woocommerce\.com/[^\"'>\s]*analytics)[^>]*>[\s\S]*?</script>",
        re.I,
    ),
    re.compile(
        r"<script[^>]*id=[\"'](?:wc-stripe[^\"']*|woocommerce-analytics[^\"']*|jetpack-stats[^\"']*)[\"'][^>]*>[\s\S]*?</script>",
        re.I,
    ),
    re.compile(r"<script[^>]+src=[\"'][^\"']*(?:trustedsite|cdn\.ywxi\.net|wsimg\.com|pixel\.wp\.com|stats\.wp\.com|js\.stripe\.com)[^\"']*[\"'][^>]*>\s*</script>", re.I),
    re.compile(r"<link[^>]*(?:trustedsite|cdn\.ywxi\.net|wsimg\.com)[^>]*>", re.I),
    re.compile(r"<img[^>]*(?:trustedsite|pixel\.wp\.com|stats\.wp\.com|wsimg\.com)[^>]*>", re.I),
    # WordPress redirect malware meta marker
    re.compile(r"<meta[^>]*name=[\"']redi-version[\"'][^>]*>", re.I),
]

# Obfuscated doorway scripts: strip only when a single <script> block looks like
# hex-obfuscated redirect malware (must not span across other tags/scripts).
MALWARE_SCRIPT_RE = re.compile(r"<script\b[^>]*>[\s\S]*?</script>", re.I)
MALWARE_MARKERS_RE = re.compile(
    r"function\s+_0x[0-9a-f]+\s*\("
    r"|yx9belqoni"
    r"|utm_term="
    r"|whitetopic"
    r"|blackdock"
    r"|redi-version",
    re.I,
)
HIJACK_PAYLOAD_RE = re.compile(
    r"\.shop['\"]|utm_term=|yx9belqoni|whitetopic|blackdock|httpGet\s*\(|appa\s*\(",
    re.I,
)

HIJACK_HOST = re.compile(
    r"https?://[a-z0-9.-]*(?:yx9belqoni|whitetopic|blackdock|\.shop)[^\s\"'<>]*",
    re.I,
)

# Broken wget convert-links / shortlink leftovers -> local pages
EXACT_LINK_MAP = {
    "slide-page/home/index.html": f"{PREFIX}/",
    "./slide-page/home/index.html": f"{PREFIX}/",
    "../slide-page/home/index.html": f"{PREFIX}/",
    "index.html%3Fp=12.html": f"{PREFIX}/courses-2/",
    "index.html%3Fp=10.html": f"{PREFIX}/my-account/",
    "index.html%3Fp=8.html": f"{PREFIX}/cart/",
    "index.html%3Fp=5.html": f"{PREFIX}/privacy-policy/",
    "index.html?p=12.html": f"{PREFIX}/courses-2/",
    "index.html?p=10.html": f"{PREFIX}/my-account/",
    "index.html?p=8.html": f"{PREFIX}/cart/",
    "index.html?p=5.html": f"{PREFIX}/privacy-policy/",
    "./index.html%3Fp=12.html": f"{PREFIX}/courses-2/",
    "./index.html%3Fp=10.html": f"{PREFIX}/my-account/",
    "./index.html%3Fp=8.html": f"{PREFIX}/cart/",
    "./index.html%3Fp=5.html": f"{PREFIX}/privacy-policy/",
    "../index.html%3Fp=12.html": f"{PREFIX}/courses-2/",
    "../index.html%3Fp=10.html": f"{PREFIX}/my-account/",
    "../index.html%3Fp=8.html": f"{PREFIX}/cart/",
    "../index.html%3Fp=5.html": f"{PREFIX}/privacy-policy/",
    "checkout/index.html": f"{PREFIX}/cart/",  # menu Cart often pointed at checkout
    "./checkout/index.html": f"{PREFIX}/cart/",
    "../checkout/index.html": f"{PREFIX}/cart/",
}

PAGE_ID_MAP = {
    "12": "courses-2",
    "10": "my-account",
    "8": "cart",
    "9": "checkout",
    "5": "privacy-policy",
    "2082": "",  # home
    "2246": "about-us-2",
    "789": "shop",
}

CSP = (
    '<meta http-equiv="Content-Security-Policy" '
    "content=\"default-src 'self'; "
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data: blob:; "
    "font-src 'self' data:; "
    "connect-src 'none'; "
    "frame-src 'none'; "
    "object-src 'none'; "
    "base-uri 'self';\">"
)


def normalize_query_filenames() -> dict[str, str]:
    """Rename files that contain '?' and return old_name -> new_name (basename) map."""
    renames: dict[str, str] = {}
    # deepest first
    files = sorted(
        [p for p in ROOT.rglob("*") if p.is_file() and "?" in p.name],
        key=lambda p: len(str(p)),
        reverse=True,
    )
    for path in files:
        name = path.name
        if "?" not in name:
            continue
        base, _, rest = name.partition("?")
        # e.g. style.min.css?ver=6.9.5.css -> style.min.css
        # e.g. index.html?p=12.html -> drop (handled via redirects)
        new_name = base
        if rest.endswith(".css") and not new_name.endswith(".css"):
            new_name = base  # already has extension before ?
        if rest.endswith(".js") and not new_name.endswith(".js"):
            new_name = base
        dest = path.with_name(new_name)
        if dest.exists() and dest != path:
            # keep existing clean file; remove query duplicate
            path.unlink(missing_ok=True)
            renames[name] = new_name
            continue
        path.rename(dest)
        renames[name] = new_name
        print(f"rename: {name} -> {new_name}")
    return renames


def strip_trackers(text: str) -> str:
    for pat in TRACKER_PATTERNS:
        text = pat.sub("", text)

    def _malware_script_sub(m: re.Match) -> str:
        block = m.group(0)
        # Only drop obfuscated redirect/hijack scripts, never generic site JS
        if MALWARE_MARKERS_RE.search(block) and HIJACK_PAYLOAD_RE.search(block):
            return ""
        if "redi-version" in block.lower() and "function _0x" in block.lower():
            return ""
        # Pure _0x obfuscated loader that builds *.shop / doorway URLs
        if re.search(r"function\s+_0x[0-9a-f]+\s*\(", block) and re.search(
            r"\.shop|utm_term=", block, re.I
        ):
            return ""
        return block

    text = MALWARE_SCRIPT_RE.sub(_malware_script_sub, text)
    text = HIJACK_HOST.sub("#", text)
    return text


def localize_abs(url: str) -> str:
    """Convert https://canadent.net/... to /canadent/..."""
    parsed = urlparse(url)
    path = parsed.path or "/"
    frag = f"#{parsed.fragment}" if parsed.fragment else ""
    if parsed.query.startswith("p="):
        pid = parsed.query.split("=", 1)[1].split("&")[0]
        if pid in PAGE_ID_MAP:
            slug = PAGE_ID_MAP[pid]
            base = f"{PREFIX}/{slug}/" if slug else f"{PREFIX}/"
            return base + frag
    if path in ("/", ""):
        return f"{PREFIX}/" + frag
    if Path(path).suffix:
        return f"{PREFIX}{path}" + frag
    if not path.endswith("/"):
        path += "/"
    return f"{PREFIX}{path}" + frag


def fix_relative_to_prefix(url: str) -> str:
    """Turn site-relative and ../ paths into /canadent/ absolute paths when they point inside the mirror."""
    if not url or url.startswith(("mailto:", "tel:", "data:", "javascript:", "http://", "https://", "//", "#", PREFIX)):
        return url
    frag = ""
    path = url
    if "#" in url:
        path, frag = url.split("#", 1)
        frag = "#" + frag
    if path in EXACT_LINK_MAP:
        return EXACT_LINK_MAP[path] + frag
    decoded = unquote(path)
    if "index.html?p=" in decoded or "index.html%3Fp=" in path:
        m = re.search(r"p=(\d+)", unquote(path))
        if m and m.group(1) in PAGE_ID_MAP:
            slug = PAGE_ID_MAP[m.group(1)]
            return (f"{PREFIX}/{slug}/" if slug else f"{PREFIX}/") + frag
    # normalize ./ and ../ noise for known top-level sections
    clean = path
    while clean.startswith("./"):
        clean = clean[2:]
    # collapse leading ../
    while clean.startswith("../"):
        clean = clean[3:]
    # common wget leftovers
    if clean in ("index.html", "./index.html"):
        return f"{PREFIX}/{frag}" if frag else f"{PREFIX}/"
    if clean.startswith("slide-page/home"):
        return f"{PREFIX}/{frag}" if frag else f"{PREFIX}/"
    # if it looks like a site path (wp-*, product/, courses-2/, etc.), prefix it
    site_roots = (
        "wp-content/", "wp-includes/", "product/", "product-category/", "product-tag/",
        "courses-2/", "my-account/", "cart/", "checkout/", "shop/", "about-us-2/",
        "privacy-policy/", "privacy/", "terms/", "events/", "upcoming-courses/",
        "previous-courses/", "contact-us/", "avada_portfolio/", "author/", "category/",
        "faq-items/", "newsletter-unsubscribe/", "sample-page/", "root-to-resolution-agenda/",
        "former-student", "how-do-you", "what-do-successful", "fusion_tb_category/",
        "element_category/", "slide-page/",
    )
    if any(clean.startswith(r) for r in site_roots) or clean.endswith("/index.html"):
        if clean.endswith("/index.html"):
            clean = clean[: -len("index.html")]
        if not clean.startswith("/"):
            clean = "/" + clean
        if not Path(clean).suffix and not clean.endswith("/"):
            clean += "/"
        return f"{PREFIX}{clean}{frag}"
    # relative asset like wp-content without leading path from nested page already cleaned
    return url


ATTR_URL_RE = re.compile(
    r"""(?P<attr>\b(?:href|src|action|data-src|data-orig-src|data-preload-img|data-bg|poster|content)=)(?P<q>["'])(?P<url>[^"']+)(?P=q)""",
    re.I,
)
SRCSET_RE = re.compile(
    r"""(?P<attr>\b(?:srcset|data-srcset)=)(?P<q>["'])(?P<val>[^"']+)(?P=q)""",
    re.I,
)
CSS_URL_RE = re.compile(r"""url\((?P<q>['"]?)(?P<url>[^'")]+)(?P=q)\)""", re.I)
ABS_IN_TEXT_RE = re.compile(r"""https?://(?:www\.)?canadent\.net[^\s\"'<>]*""", re.I)


def map_url(url: str) -> str:
    if not url:
        return url
    u = url.strip()
    if u.startswith(("mailto:", "tel:", "data:", "javascript:", "blob:")):
        return u
    if u.startswith("#"):
        return u
    # exact map first
    base, frag = (u.split("#", 1) + [""])[:2]
    frag = f"#{frag}" if frag else ""
    if base in EXACT_LINK_MAP:
        return EXACT_LINK_MAP[base] + frag
    if unquote(base) in EXACT_LINK_MAP:
        return EXACT_LINK_MAP[unquote(base)] + frag

    if re.match(r"https?://(?:www\.)?canadent\.net", u, re.I):
        return localize_abs(u)

    # protocol-relative
    if u.startswith("//canadent.net") or u.startswith("//www.canadent.net"):
        return localize_abs("https:" + u)

    return fix_relative_to_prefix(u)


def rewrite_srcset(val: str) -> str:
    parts = []
    for item in val.split(","):
        item = item.strip()
        if not item:
            continue
        bits = item.split()
        if not bits:
            continue
        bits[0] = map_url(bits[0])
        parts.append(" ".join(bits))
    return ", ".join(parts)


def rewrite_text(text: str) -> str:
    text = strip_trackers(text)

    def attr_sub(m: re.Match) -> str:
        return f"{m.group('attr')}{m.group('q')}{map_url(m.group('url'))}{m.group('q')}"

    text = ATTR_URL_RE.sub(attr_sub, text)

    def srcset_sub(m: re.Match) -> str:
        return f"{m.group('attr')}{m.group('q')}{rewrite_srcset(m.group('val'))}{m.group('q')}"

    text = SRCSET_RE.sub(srcset_sub, text)

    def css_sub(m: re.Match) -> str:
        return f"url({m.group('q')}{map_url(m.group('url'))}{m.group('q')})"

    text = CSS_URL_RE.sub(css_sub, text)

    # leftover absolute URLs in JSON / preload / inline JS
    text = ABS_IN_TEXT_RE.sub(lambda m: map_url(m.group(0)), text)

    # Fix remaining encoded shortlinks in free text
    text = text.replace("index.html%3Fp=12.html", f"{PREFIX}/courses-2/")
    text = text.replace("index.html%3Fp=10.html", f"{PREFIX}/my-account/")
    text = text.replace("index.html%3Fp=8.html", f"{PREFIX}/cart/")
    text = text.replace("index.html%3Fp=5.html", f"{PREFIX}/privacy-policy/")
    text = text.replace("slide-page/home/index.html", f"{PREFIX}/")

    # Menu: Cart should go to cart not checkout (already mapped checkout/index.html)
    # Contact us
    text = re.sub(
        r"https?://(?:www\.)?canadent\.net/contact-us/?",
        f"{PREFIX}/contact-us/",
        text,
        flags=re.I,
    )

    # Add CSP once
    if "<html" in text.lower() and "Content-Security-Policy" not in text:
        text = re.sub(
            r"(<head[^>]*>)",
            r"\1\n" + CSP,
            text,
            count=1,
            flags=re.I,
        )

    # Strip ?ver= / %3Fver= query leftovers from asset URLs (wget --adjust-extension)
    text = re.sub(
        r"((?:/canadent/|\.\./)*(?:wp-content|wp-includes)/[^\"'\s]+?\.(?:css|js|png|jpe?g|gif|webp|svg|woff2?|ttf|eot))"
        r"(?:\?ver=[^\"'\s]+|%3Fver=[^\"'\s]+)",
        r"\1",
        text,
        flags=re.I,
    )
    # Also handle wget's ".css?ver=hash.css" encoded as ".css%3Fver=hash.css"
    text = re.sub(
        r"(\.(?:css|js))%3Fver=[^\"'\s]+?\.(?:css|js)",
        r"\1",
        text,
        flags=re.I,
    )
    text = re.sub(r"(\.(?:css|js))\?ver=[^\"'\s]+?\.(?:css|js)", r"\1", text, flags=re.I)

    return text


def process_files() -> None:
    exts = {".html", ".htm", ".css", ".js", ".json", ".xml", ".svg", ".txt"}
    count = 0
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in exts and not path.name.endswith(".html"):
            continue
        # skip huge binary-looking
        try:
            raw = path.read_text("utf-8", errors="replace")
        except Exception:
            continue
        new = rewrite_text(raw)
        if new != raw:
            path.write_text(new, "utf-8")
            count += 1
    print(f"rewrote {count} files")


def ensure_contact_us() -> None:
    dest = ROOT / "contact-us" / "index.html"
    if dest.exists():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    # Clone about-us-2 chrome and replace main content
    src = ROOT / "about-us-2" / "index.html"
    if not src.exists():
        src = ROOT / "index.html"
    html = src.read_text("utf-8", errors="replace")
    # Replace title
    html = re.sub(r"<title>[^<]*</title>", "<title>Contact Us - Canadent</title>", html, count=1, flags=re.I)
    # Replace main content roughly
    contact_body = """
<div class="fusion-fullwidth fullwidth-box" style="padding:80px 20px;background:#fff;">
  <div style="max-width:720px;margin:0 auto;">
    <h1>Contact Us</h1>
    <p>The live site links to this page, but it currently returns 404 on canadent.net. This local page is provided so the menu works offline.</p>
    <p><strong>Phone:</strong> <a href="tel:1.437.370.0122">1.437.370.0122</a> (24hrs)</p>
    <p><strong>Social:</strong></p>
    <ul>
      <li><a href="https://www.facebook.com/canadent.edu.92" target="_blank" rel="noopener">Facebook</a></li>
      <li><a href="https://twitter.com/canadentedu" target="_blank" rel="noopener">X / Twitter</a></li>
      <li><a href="https://www.youtube.com/channel/UClpOZ-PocMXQfj3RW9HileA" target="_blank" rel="noopener">YouTube</a></li>
      <li><a href="https://www.instagram.com/canadentedu/" target="_blank" rel="noopener">Instagram</a></li>
    </ul>
  </div>
</div>
"""
    # Try to replace post-content
    if 'class="post-content"' in html:
        html = re.sub(
            r'(<div class="post-content">).*?(</div>\s*</div>\s*</div>\s*<div class="fusion-fullwidth[^"]*footer|</main>|<!--\s*fusion-footer)',
            r"\1" + contact_body + r"\2",
            html,
            count=1,
            flags=re.S,
        )
    else:
        html = contact_body
    dest.write_text(html, "utf-8")
    print("created contact-us page")


def enhance_my_account_dashboard() -> None:
    """Add a static dashboard panel above the login form for offline browsing."""
    path = ROOT / "my-account" / "index.html"
    if not path.exists():
        return
    html = path.read_text("utf-8", errors="replace")
    if "canadent-static-dashboard" in html:
        return
    panel = """
<div class="canadent-static-dashboard" style="max-width:960px;margin:30px auto;padding:24px;border:1px solid #e5e5e5;background:#fafafa;">
  <h2 style="margin-top:0;">My Account</h2>
  <p>This is a static mirror. Live login is unavailable offline. Browse account sections below (each page shows the public/login state captured from the site):</p>
  <ul class="woocommerce-MyAccount-navigation" style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:12px;">
    <li><a href="/canadent/my-account/">Dashboard</a></li>
    <li><a href="/canadent/my-account/orders/">Orders</a></li>
    <li><a href="/canadent/my-account/downloads/">Downloads</a></li>
    <li><a href="/canadent/my-account/edit-address/">Addresses</a></li>
    <li><a href="/canadent/my-account/payment-methods/">Payment methods</a></li>
    <li><a href="/canadent/my-account/edit-account/">Account details</a></li>
    <li><a href="/canadent/my-account/lost-password/">Lost password</a></li>
  </ul>
</div>
"""
    # Insert before login form if present
    if "woocommerce-form-login" in html:
        html = html.replace(
            '<form class="woocommerce-form woocommerce-form-login',
            panel + '<form class="woocommerce-form woocommerce-form-login',
            1,
        )
        path.write_text(html, "utf-8")
        print("enhanced my-account dashboard nav")
    elif 'class="woocommerce"' in html:
        html = html.replace('<div class="woocommerce">', '<div class="woocommerce">' + panel, 1)
        path.write_text(html, "utf-8")
        print("enhanced my-account dashboard nav (woocommerce wrap)")


def download_missing_images() -> None:
    """Fetch upload assets referenced but missing locally (one URL at a time)."""
    import time

    urls: set[str] = set()
    path_re = re.compile(
        r"(?:https?://(?:www\.)?canadent\.net/|/canadent/|(?:\.\./)*)"
        r"(wp-content/uploads/[^\s,\"'<>]+)",
        re.I,
    )
    for path in ROOT.rglob("*.html"):
        text = path.read_text("utf-8", errors="replace")
        for m in path_re.finditer(text):
            rel = unquote(m.group(1))
            # drop srcset descriptors accidentally glued on
            rel = rel.split()[0]
            rel = rel.split("?")[0].split("%3F")[0]
            if re.search(r"\.(?:png|jpe?g|gif|webp|svg|css|js)$", rel, re.I):
                urls.add(rel)

    missing = [rel for rel in sorted(urls) if not (ROOT / rel).exists()]
    print(f"missing uploads: {len(missing)}")
    ok = 0
    for i, rel in enumerate(missing):
        url = "https://canadent.net/" + rel
        dest = ROOT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                dest.write_bytes(resp.read())
            ok += 1
            if ok <= 20 or ok % 25 == 0:
                print("got", rel)
        except Exception as e:
            print("fail", rel, e)
            if "429" in str(e):
                time.sleep(2)
                continue
        if i % 10 == 0:
            time.sleep(0.2)
    print(f"downloaded {ok}/{len(missing)}")


def write_mirror_info() -> None:
    (ROOT / "MIRROR_INFO.txt").write_text(
        """Static mirror of https://canadent.net
Refreshed: 2026-07-26

Includes:
- Full Avada header menus (Home, Courses, My account, Enrolment Agreement, Cart, Contact Us)
- Courses page with product image gallery links
- Shop and product pages
- My Account (login UI + static section navigation; live auth unavailable offline)
- Cart / Checkout / Privacy / About / Events

Security:
- Tracker scripts stripped (TrustedSite, GoDaddy wsimg, Jetpack stats, Stripe.js)
- Redirect-malware / obfuscated doorway scripts removed
- Absolute canadent.net URLs rewritten to /canadent/... local paths
- Content-Security-Policy: self scripts/styles/images; connect-src none

Serve from repo root:
  python3 -m http.server 8080 --bind 0.0.0.0
  http://127.0.0.1:8080/canadent/
""",
        encoding="utf-8",
    )


def remove_query_html_dupes() -> None:
    for p in ROOT.glob("index.html?p=*.html"):
        p.unlink(missing_ok=True)
        print("removed", p.name)


def fix_menu_cart_links() -> None:
    """Ensure menu item Cart points to /canadent/cart/ even if href was checkout."""
    for path in ROOT.rglob("*.html"):
        html = path.read_text("utf-8", errors="replace")
        # menu-item-93 is Cart
        new = re.sub(
            r'(id="menu-item-93"[^>]*>.*?href=")([^"]+)(")',
            rf'\1{PREFIX}/cart/\3',
            html,
            flags=re.S,
        )
        # Courses menu-item-2303
        new = re.sub(
            r'(id="menu-item-2303"[^>]*>.*?href=")([^"]+)(")',
            rf'\1{PREFIX}/courses-2/\3',
            new,
            flags=re.S,
        )
        # My account menu-item-144
        new = re.sub(
            r'(id="menu-item-144"[^>]*>.*?href=")([^"]+)(")',
            rf'\1{PREFIX}/my-account/\3',
            new,
            flags=re.S,
        )
        # Home menu-item-2301
        new = re.sub(
            r'(id="menu-item-2301"[^>]*>.*?href=")([^"]+)(")',
            rf'\1{PREFIX}/\3',
            new,
            flags=re.S,
        )
        # Enrolment Agreement menu-item-779
        new = re.sub(
            r'(id="menu-item-779"[^>]*>.*?href=")([^"]+)(")',
            rf'\1{PREFIX}/privacy-policy/\3',
            new,
            flags=re.S,
        )
        # Contact Us menu-item-1205
        new = re.sub(
            r'(id="menu-item-1205"[^>]*>.*?href=")([^"]+)(")',
            rf'\1{PREFIX}/contact-us/\3',
            new,
            flags=re.S,
        )
        if new != html:
            path.write_text(new, "utf-8")


def main() -> None:
    os.chdir(ROOT)
    print("== normalize query filenames ==")
    normalize_query_filenames()
    print("== download missing images (pre-rewrite scan) ==")
    download_missing_images()
    print("== ensure contact-us ==")
    ensure_contact_us()
    print("== rewrite files ==")
    process_files()
    print("== fix menu item hrefs ==")
    fix_menu_cart_links()
    print("== enhance my-account ==")
    enhance_my_account_dashboard()
    print("== remove query html dupes ==")
    remove_query_html_dupes()
    print("== download missing images (post) ==")
    download_missing_images()
    write_mirror_info()
    print("done")


if __name__ == "__main__":
    main()
