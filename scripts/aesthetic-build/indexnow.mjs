#!/usr/bin/env node
/**
 * IndexNow batch submitter for the CanaDent aesthetic-training articles.
 *
 * IndexNow (https://www.indexnow.org) notifies participating search engines —
 * Bing, Yandex, Seznam, Naver (NOT Google, which does not use IndexNow) — of
 * URLs to (re)crawl, up to 10,000 per request.
 *
 * How it works:
 *   1. A key file must be live at  https://www.canadent.net/<KEY>.txt  whose
 *      contents are exactly <KEY>. (Committed at public/<KEY>.txt.)
 *   2. This script pulls the current URL list straight from the live
 *      sitemap-aesthetic.xml (so it always matches what is deployed) and POSTs
 *      them to the shared IndexNow endpoint.
 *
 * Usage:  node scripts/aesthetic-build/indexnow.mjs
 *         node scripts/aesthetic-build/indexnow.mjs --dry   (print payload only)
 */

const HOST = "www.canadent.net";
const KEY = "31a87c95c0dfc7eed7422a3b87edb153";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap-aesthetic.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const DRY = process.argv.includes("--dry");

async function main() {
  // 1) Pull URLs from the live sitemap
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "canadent-indexnow" } });
  if (!res.ok) throw new Error(`Could not fetch sitemap (${res.status}). Is it deployed?`);
  const xml = await res.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) throw new Error("No <loc> URLs found in sitemap.");
  console.log(`Found ${urlList.length} URLs in ${SITEMAP}`);

  // 2) Verify the key file is live before submitting
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    throw new Error(
      `Key file check failed at ${KEY_LOCATION} (status ${keyRes.status}, body "${keyBody.slice(0, 40)}"). ` +
        `Deploy public/${KEY}.txt before submitting.`
    );
  }
  console.log(`Key file verified at ${KEY_LOCATION}`);

  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  if (DRY) {
    console.log("\n--dry run; payload would be:\n");
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  // 3) Submit
  const submit = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await submit.text();
  console.log(`\nIndexNow response: HTTP ${submit.status}`);
  if (body) console.log(body);
  // IndexNow returns 200 (OK) or 202 (Accepted) on success.
  if (submit.status === 200 || submit.status === 202) {
    console.log(`\n✅ Submitted ${urlList.length} URLs to IndexNow (Bing/Yandex/Seznam/Naver).`);
  } else {
    console.log("\n⚠️  Non-success status — see the IndexNow status-code reference for the meaning.");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("❌ " + e.message);
  process.exitCode = 1;
});
