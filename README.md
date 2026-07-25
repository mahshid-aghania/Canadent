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

## Notes

- These are static HTML snapshots, not runnable WordPress installs.
- Remote trackers/analytics and known redirect-malware URL patterns were stripped.
- Absolute live-site URLs were rewritten to local root-relative paths.
- Cart/checkout/account/forms will not function dynamically.
