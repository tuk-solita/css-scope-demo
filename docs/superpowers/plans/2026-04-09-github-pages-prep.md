# GitHub Pages Preparation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Vite app deploy correctly to a GitHub Pages project site with automatic deployment from the default branch.

**Architecture:** Keep the application code unchanged and fix deployment at the build and repository level. Use Vite relative production asset paths, a standard GitHub Pages Actions workflow that publishes `dist/`, and a small README section that explains local development and the one-time GitHub Pages setup.

**Tech Stack:** Vite 5, Vitest, GitHub Actions, GitHub Pages

---

## File map

- Modify: `vite.config.js` — add the Pages-safe production base while preserving the existing `src` root and `dist` output.
- Create: `.github/workflows/deploy-pages.yml` — build and deploy the static site to GitHub Pages.
- Create or modify: `README.md` — document local development, production build, and GitHub Pages setup.

## Chunk 1: Build and deployment configuration

### Task 1: Make Vite emit Pages-safe asset URLs

**Files:**
- Modify: `vite.config.js`
- Verify: `dist/index.html`

- [ ] **Step 1: Update the Vite config**

Add `base: './'` to the exported Vite config so built assets are referenced relative to `index.html`.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds and writes the app into `dist/`.

- [ ] **Step 3: Verify the generated asset paths**

Inspect `dist/index.html`.
Expected: built script and stylesheet URLs are relative such as `./assets/...` or `assets/...`, not `/assets/...`.

### Task 2: Add the GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Create the Pages workflow file**

Define a workflow that:
- runs on pushes to the default branch and manual dispatch
- uses Node 20
- runs `npm ci`
- runs `npm run build`
- configures Pages with `actions/configure-pages`
- uploads `dist/` with `actions/upload-pages-artifact`
- deploys with `actions/deploy-pages`
- grants `contents: read`, `pages: write`, and `id-token: write`
- uses the `github-pages` environment

- [ ] **Step 2: Validate the workflow structure**

Review the workflow YAML for:
- push and manual dispatch triggers
- `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`
- `contents: read`, `pages: write`, and `id-token: write` permissions
- the `github-pages` environment
- correct artifact path and job dependencies

Expected: the deploy job depends on the build job, publishes `dist/`, and includes the standard Pages permissions and environment.

## Chunk 2: Documentation and verification

### Task 3: Add repository usage and deployment notes

**Files:**
- Create or modify: `README.md`

- [ ] **Step 1: Add concise local development instructions**

Document:
- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`

- [ ] **Step 2: Add GitHub Pages setup notes**

Document:
- enable GitHub Pages in repository settings
- choose GitHub Actions as the source
- pushes to the default branch trigger deployment automatically

### Task 4: Run final verification

**Files:**
- Verify: `vite.config.js`
- Verify: `.github/workflows/deploy-pages.yml`
- Verify: `README.md`

- [ ] **Step 1: Run the test suite**

Run: `npm run test`
Expected: existing tests still pass.

- [ ] **Step 2: Re-run the production build**

Run: `npm run build`
Expected: build succeeds after all repo changes.

- [ ] **Step 3: Confirm the deployment assumptions**

Review the generated `dist/index.html` and workflow file together.
Expected: the built site uses relative asset URLs, the workflow uploads the same `dist/` directory, and the workflow includes the standard Pages permissions and `github-pages` environment.

- [ ] **Step 4: Check the built app under a repository-style path**

Serve the built output from a local URL that includes a nested path segment resembling `/<repo>/`.
Expected: the app loads successfully without broken asset requests when opened from a repository-style subpath.
