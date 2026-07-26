# Canadent + ConfiDentist

Combined static mirrors of:

- **Canadent** (`canadent/`) — https://canadent.net
- **ConfiDentist** (`confidentist/`) — https://www.confidentist.ca

Both brands share the same Toronto training centre (265 Rimrock Road) and are included here for offline/reference browsing.

## Browse locally

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then open:

- Hub: http://127.0.0.1:8080/
- Canadent: http://127.0.0.1:8080/canadent/
- ConfiDentist: http://127.0.0.1:8080/confidentist/

## Canadent mirror

Full static copy of https://canadent.net including:

- Home with Avada header menus (Home, Courses, My account, Enrolment Agreement, Cart, Contact Us)
- Courses gallery with product images/links
- Shop + product pages
- My Account (login UI + offline section navigation)
- Cart / Checkout / Privacy / About / Events

See `canadent/MIRROR_INFO.txt` for security notes.

## Notes

- These are static HTML snapshots, not runnable WordPress installs.
- Remote trackers/analytics and known redirect-malware URL patterns were stripped.
- Absolute live-site URLs were rewritten to local root-relative paths.
- Cart/checkout/account/forms will not function dynamically.
