
---

## 🚀 Deployment Workflow (Vercel)

1. **Push to `main`** → automatic **Production Deployment**  
   → [https://appmurmaxexpress.com](https://appmurmaxexpress.com)

2. **Push to `staging` or feature branches** → Preview URLs for testing.  
   → Example: `https://murmax-truckshare-git-featureX.vercel.app`

3. **Promote builds**  
   → Vercel Dashboard → Deployments → ⋯ → *Promote to Production*

---

## 🧩 Environment Variables (Vercel Settings)

| Key | Example | Environment |
|-----|----------|--------------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | All |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | All |

> ⚠️ Never commit `.env` files.  
> Keep variables in **Vercel → Settings → Environment Variables → All Environments**.

---

## 🧱 MurMax Standard Rule™ — Code Update Protocol

To maintain consistency and prevent deployment errors:

1. **Every edit or addition** must include the *complete file code*, not partial snippets.  
2. **All file paths** must be declared explicitly (`src/pages/Loads.tsx`, `src/lib/supabase.ts`, etc.).  
3. **Each update** includes:
   - ✅ Full replacement code (copy-paste ready)  
   - ✅ File name and purpose  
   - ✅ Post-update verification steps (Vercel or local)  
4. **Developers** must test locally:
   ```bash
   npm run build && npm run preview
