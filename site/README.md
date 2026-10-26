# UWA Aerospace website

New to looking after the site? Start with HANDOVER.md.

Static site for GitHub Pages. No build step.

## Deploy
1. Create a new repo under the UWA Aerospace GitHub org, e.g. `uwaaerospace.github.io` or `website`.
2. Upload everything in this folder to the repo root (including `CNAME` and `.nojekyll`).
3. Repo → Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Settings → Pages → Custom domain: `uwaaerospace.org`. Tick "Enforce HTTPS" once it becomes available (can take up to a day).

## GoDaddy DNS (domain stays at GoDaddy)
In GoDaddy → My Products → uwaaerospace.org → DNS:

- Delete any existing **A** records for `@` (and any "Parked"/forwarding record).
- Add four **A** records, name `@`:
  185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153
- Add/replace **CNAME**: name `www` → `<your-org>.github.io`

**Do not touch** the MX, TXT (SPF / verification), `autodiscover` CNAME or any other records used by Microsoft 365 Essential Email — those keep executive@ working.

## Forms and calendar
The Join, Book a visit and Become a sponsor forms, and the Calendar page, all talk to the Budget Manager (see `budget-manager-patch/README.md`).
Set the app address once in `site-config.js`:
`window.UWA_API = "https://<your-budget-app>.vercel.app";`
Until it is set, forms open the visitor's email app and the calendar shows "No dates published yet".

## Editing
Each page is a single HTML file. Text and styles are inline; page data (lists, team, sponsors) is in the script block at the bottom of each file.
