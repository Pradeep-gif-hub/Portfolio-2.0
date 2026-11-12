# Portfolio 2.0

Personal site for Pradeep Kumar Awasthi. The public pages and the admin panel share one MongoDB database, so content changes without editing the React code.

[awasthi.tech](https://www.awasthi.tech)

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, GitHub activity, stack, projects, experience, certifications, what I'm exploring, contact |
| `/projects`, `/project/:id` | Project list and a single project |
| `/blog`, `/blog/:slug` | Posts |
| `/gallery` | Photos |
| `/places` | Visited places on a MapLibre map |
| `/exploring` | Things currently being learned |
| `/certifications`, `/certification/:id` | Certificates |
| `/experience/:id` | One role |
| `/innings` | A longer personal note |
| `/about` | Bio |
| `/links` | Social links |
| `/admin-login` | Admin sign-in |

Admin routes under `/admin` cover projects, blogs, experience, certifications, places, exploring, gallery, tools, and site settings.

## Stack

React 18, TypeScript, Vite, Tailwind, Framer Motion. API routes are Vercel serverless functions. Data is MongoDB through Mongoose. Admin login checks a bcrypt password hash, then emails a one-time code.

## Run locally

Node 18 or newer.

```bash
git clone https://github.com/Pradeep-gif-hub/Portfolio-2.0.git
cd Portfolio-2.0
npm install
```

Create `.env.local`:

```env
MONGODB_URI=
MONGODB_DB_NAME=portfolio
JWT_SECRET=
ADMIN_PASSWORD_HASH=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
VITE_API_URL=/api
LASTFM_API_KEY=
LASTFM_USERNAME=
```

`JWT_SECRET` comes from `node generate-secrets.cjs`. `ADMIN_PASSWORD_HASH` comes from `node generate-password-hash.cjs`. The login API compares the typed password to that hash. SMTP is required for the email code. Last.fm is only for the now-playing widget.

Then:

```bash
node initialize-settings.cjs
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Admin is [http://localhost:5173/admin-login](http://localhost:5173/admin-login). The email used for the code is the one saved by `initialize-settings.cjs`.

Optional seed scripts, if the database should start with sample records: `add-demo-projects.cjs`, `add-demo-blogs.cjs`, `add-demo-experiences.cjs`, `add-demo-certifications.cjs`, `add-demo-tools.cjs`, `add-demo-places.cjs`.

## Deploy

The site is deployed on Vercel from this repo. Set the same variables in the Vercel project. `vercel.json` sends `/api/*` to the serverless functions and every other path to `index.html`.
