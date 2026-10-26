# UWA Aerospace website: handover guide

For whoever looks after the website next year. No coding experience needed for most of this.

## Where things live
| What | Where |
|---|---|
| Website files | GitHub repo for the site (this folder). Every push to `main` goes live in about a minute. |
| Domain (uwaaerospace.org) and email | GoDaddy. DNS points the domain at GitHub Pages. **Never delete the MX/TXT/autodiscover records**: they run executive@ email. |
| Applications, visit requests, sponsor enquiries, public calendar | Budget Manager app (Vercel) → sidebar group **Website** |
| Photos | Currently loaded from the old Squarespace site. Move them into an `images/` folder here before that account closes. |

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
Upload the image to `images/` on GitHub (JPEG, about 2000px wide), then replace the old address in the page with `images/your-photo.jpg`.

**Add a sponsor logo**
Upload a PNG with a transparent background to `images/`. Add a line to the sponsor list in `sponsors.html` and to `sponsorLogos` in `index.html`.

## Each year
- Update the committee roles on `team.html` if the structure changes.
- Update member count and figures on `index.html` (search for `memberCount`).
- Change "© 2026" in the footers (search and replace across all pages).
- Check the GoDaddy domain renewal date.
- Hand over the logins above and change the passwords.

## If something breaks
- **Forms open an email app instead of sending:** `site-config.js` has an empty or wrong `UWA_API`, or the Budget Manager is down.
- **Forms say "Not allowed from this site":** the Vercel env var `ALLOWED_ORIGINS` is missing the domain.
- **Site not loading after a DNS change:** GitHub → Settings → Pages should show the custom domain with a green tick. DNS changes can take a few hours.
- **Undo a bad edit:** GitHub → the file → History → open the previous version → Revert.
