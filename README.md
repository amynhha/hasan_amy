# Hasan & Amy wedding site

1. `npm install` then `npm run dev` (open the local link; also works on phone via the Network URL).
2. Edit `src/config.js`: time, venue, address, story, photos (put images in `public/photos/`).
3. Google Sheet RSVPs: create a Sheet > Extensions > Apps Script > paste `apps-script/Code.gs` > Deploy > New deployment > Web app (Execute as: Me, Access: Anyone) > copy the URL into `rsvpEndpoint` in `src/config.js`.
4. `npm run build` and upload `dist/` to Netlify, Vercel or GitHub Pages.
