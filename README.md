# 🚀 MLOps Elite Roadmap

**12-Week interactive roadmap: Python + DevOps + AWS → MTech + MLOps Engineer**

Live at: `https://YOUR_USERNAME.github.io/mlops-roadmap`

---

## Deploy to GitHub Pages in 5 steps

### Step 1 — Create GitHub repo
1. Go to github.com → click **New repository**
2. Name it exactly: `mlops-roadmap`
3. Set to **Public**
4. Do NOT initialize with README (you already have one)
5. Click **Create repository**

### Step 2 — Upload this folder
```bash
# In your terminal, navigate to this folder, then:
git init
git add .
git commit -m "🚀 Initial commit - MLOps roadmap"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mlops-roadmap.git
git push -u origin main
```
> Replace `YOUR_USERNAME` with your actual GitHub username

### Step 3 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source** → select **GitHub Actions**
5. Click **Save**

### Step 4 — Wait ~2 minutes
GitHub Actions will automatically build and deploy your site.
You can watch progress under the **Actions** tab in your repo.

### Step 5 — Visit your live site
```
https://YOUR_USERNAME.github.io/mlops-roadmap
```

---

## If you rename the repo
Open `vite.config.js` and change:
```js
base: '/mlops-roadmap/',
// to:
base: '/your-new-repo-name/',
```
Then push again.

## Local development
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

---

**Progress is saved in your browser's localStorage** — it persists across sessions on the same device/browser.
