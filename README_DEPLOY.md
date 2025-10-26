# MurMax Express® Rideshare — Deploy to cPanel

Use one of the scripts in `scripts/` to build and package your site for upload.

## Quick steps
```bash
# macOS/Linux
cd scripts
chmod +x deploy.sh
./deploy.sh

# Windows (CMD)
scripts\deploy.cmd

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1
```

When finished, a file named `dist_upload.zip` is created in the project root.
Upload **dist_upload.zip** to your cPanel **public_html** (or your domain's web root) and **extract** it there.


---

## Docker (local or server)
Build and run the optimized static build behind nginx:

```bash
docker build -t murmax-rideshare .
docker run -p 8080:80 murmax-rideshare
# open http://localhost:8080
```

Using docker-compose:
```bash
docker-compose up --build
```

## GitHub Actions (build & publish dist artifact)
- Push this repo to GitHub.
- Ensure your default branch is `main` (or `master`).
- The workflow `.github/workflows/build-dist.yml` will:
  1. Install deps
  2. Build the app
  3. Upload `dist_artifact.zip` as an artifact on every push
- You can download the artifact from the Actions run page and upload to cPanel.

---

## GitHub Pages (zero-config)
1. Push this repo to GitHub.
2. Ensure the default branch is `main` (or `master`).
3. Add repository secrets (optional):
   - `VITE_API_URL` (your API base URL)
4. The workflow `.github/workflows/deploy-gh-pages.yml` will build and publish to GitHub Pages automatically.

## Cloudflare Pages
Add repository secrets:
- `CLOUDFLARE_API_TOKEN` (Pages write token)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT`
- (optional) `VITE_API_URL`
The workflow `.github/workflows/deploy-cloudflare-pages.yml` will publish `dist/`.

## Environment files
- Use `.env.local` during development and `.env.production` for production.
- Only variables prefixed with `VITE_` are exposed to the client (e.g., `VITE_API_URL`).
