# UWA Aerospace website: handover guide

For whoever looks after the website next year. No coding experience needed for most of this.

## Where things live
| What | Where |
|---|---|
| Website files | GitHub repo for the site (this folder). Every push to `main` goes live in about a minute. |
| Domain (uwaaerospace.org) and email | GoDaddy. DNS points the domain at GitHub Pages. **Never delete the MX/TXT/autodiscover records**: they run executive@ email. |
| Applications, visit requests, sponsor enquiries, public calendar | Budget Manager app (Vercel) → sidebar group **Website** |
| Photos | `assets/images/` folder in this repo. Nothing loads from Squarespace. |

Logins to hand over: GitHub org owner, GoDaddy, Vercel, Resend, Budget Manager exec account.

## Everyday jobs

**Add or change an event on the Calendar page**
Budget Manager → Projects and events → give the event a start date (and place) → Website → Website calendar → tick it and pick its type → Save. It appears on the site within 10 minutes.

**Reply to applicants, schools and sponsors**
Budget Manager → Website → Applications / Visit requests. Change the status and add notes so the rest of the committee can see where each one is up to. Sponsor enquiries appear in the Sponsor pipeline with the next step "Reply to website enquiry".

**Edit text on a page**
On GitHub, open the page (e.g. `sponsors.html`) → pencil icon → find the sentence (Ctrl/Cmd+F) → change it → Commit changes. Only change the words between `>` and `<`.

**Lists (sub-teams, sponsors, committee roles, vehicles)**
These are in the script block at the bottom of each page, as lines like
`{ no: "06", name: "Operations", desc: "…" }`. Edit the text inside the quotes. Keep the quotes and commas.

**Swap a photo**
Upload the image to `assets/images/site/` on GitHub (JPEG, about 2000px wide), then replace the old address in the page with `assets/images/site/your-photo.jpg`.

**Add a sponsor logo**
Upload a PNG with a transparent background to `assets/images/site/`. Add a line to the sponsor list in `sponsors.html` and to `sponsorLogos` in `index.html`.

## Each year
- Update the committee roles on `team.html` if the structure changes.
- Update member count and figures on `index.html` (search for `memberCount`).
- Change "© 2026" in the footers (search and replace across all pages).
- Check the GoDaddy domain renewal date.
- Hand over the logins above and change the passwords.

## Security
Do these once, then check them at each handover.
- **Two-factor login** on GitHub, Vercel, GoDaddy, Resend, Google/Microsoft (executive@ email) and the Budget Manager exec accounts. Store backup codes in the club password manager, not one person's phone.
- **Shared password manager** (e.g. Bitwarden free organisation) for every club login. Nobody should use a personal account as the only owner.
- **Two owners on everything**: at least two current committee members as owner/admin on GitHub, Vercel and GoDaddy, so the club is never locked out.
- **GitHub**: Settings → Branches → protect `main` (block force pushes and deletion). Settings → Pages → tick **Enforce HTTPS**.
- **Vercel**: Firewall → add a rate-limit rule on `/api/*` if your plan has it. Keep `ALLOWED_ORIGINS` to the club's own addresses.
- **GoDaddy**: turn on **Domain Lock** and auto-renew, keep the contact email a club address. Optional: DNSSEC.
- **Handover**: when someone leaves the committee, remove them from GitHub, Vercel, GoDaddy and the Budget Manager, then change any shared passwords.
- **Personal data**: applications include student numbers. Only download CSV exports when needed, delete them afterwards, and clear out old declined applications each year.
- Security reports come to executive@ via `/.well-known/security.txt`. Update its `Expires` date each year.

## If something breaks
- **Forms open an email app instead of sending:** `assets/js/site-config.js` has an empty or wrong `UWA_API`, or the Budget Manager is down.
- **Forms say "Not allowed from this site":** the Vercel env var `ALLOWED_ORIGINS` is missing the domain.
- **Site not loading after a DNS change:** GitHub → Settings → Pages should show the custom domain with a green tick. DNS changes can take a few hours.
- **Undo a bad edit:** GitHub → the file → History → open the previous version → Revert.

## Where things are
- Pages: the `.html` files at the top of the repo (`index.html` is the Home page).
- Must stay at the top: `index.html`, `404.html`, `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `.well-known/`.
- `assets/js/`: `site-config.js` (app address), `rocketry-fx.js` (animations, video), `support.js` (page engine, don't edit).
- `assets/images/`: `site/` (general photos, logos, videos), `fleet/` (rockets), `missions/` (competition photos).
- `docs/`: this guide.

## Hero video
Two files in `assets/images/site/`: `hero-launch.mp4` (desktop) and `hero-launch-mobile.mp4` (phones). To replace them, export from the original in HandBrake: MP4, Web Optimized, no audio, H.264, 30 fps constant, preset Slow. Desktop: width 1080, RF 25. Phone: width 720, RF 28. Aim for under 5 MB and under 3 MB.

## Uploading hidden files
GitHub's upload page skips files starting with a dot. Create `.nojekyll` (empty) and `.well-known/security.txt` with **Add file → Create new file** instead, or use GitHub Desktop.
