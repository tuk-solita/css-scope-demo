# GitHub Pages Preparation — Design Specification

Prepare the Vite-based teaching app for deployment as a GitHub Pages project site with automatic deployment from the default branch.

## Goal

Make the repository deploy cleanly to a GitHub Pages project URL such as `https://<owner>.github.io/<repo>/` without requiring repo-name-specific application code.

## Approved direction

Use a relative production base in Vite and deploy the generated `dist/` folder with a GitHub Actions Pages workflow.

This approach is intentionally portable:

- it fixes the current root-relative asset output problem
- it works for the current repository name without hardcoding that name into app config
- it remains friendly to forks and future repository renames
- it keeps local development unchanged

## Current blocker

The source app already references local assets with relative paths, but the current production build emits root-relative asset URLs like `/assets/...`.

That works when the site is served from the domain root, but fails on a GitHub Pages project site where the app is hosted under a repository subpath.

## Proposed changes

### Vite configuration

Update `vite.config.js` so production output uses relative asset paths by adding `base: './'` to the Vite config.

Expected result:

- `dist/index.html` references built assets with relative paths rather than `/assets/...`
- the app works when opened under a GitHub Pages project path
- local development via `vite` remains straightforward

### Deployment workflow

Add a GitHub Actions workflow that:

- runs on pushes to the default branch
- uses a current LTS Node release such as Node 20
- installs dependencies with `npm ci`
- builds the app with `npm run build`
- uploads the `dist/` directory as the Pages artifact
- deploys the artifact to GitHub Pages

The workflow should follow the standard Pages model using GitHub-managed deployment permissions rather than committing built files back into the repository.

Implementation should use the standard Pages actions:

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

The workflow should grant the minimum required permissions for the deployment job, including `pages: write` and `id-token: write`, and use the standard `github-pages` environment for deployment.

### Repository guidance

Add short contributor-facing documentation for the one-time repository setting needed in GitHub:

- enable GitHub Pages
- choose GitHub Actions as the deployment source
- understand that pushes to the default branch will trigger a fresh deployment

If the repository does not already have a `README.md`, create a minimal one that includes local development and Pages deployment notes.

That documentation should include:

- local setup with `npm install`
- development with `npm run dev`
- production build with `npm run build`
- the one-time Pages setup in repository settings
- a note that deployments publish the built `dist/` folder automatically

## Files expected to change

- `vite.config.js`
- `.github/workflows/deploy-pages.yml`
- `README.md` if absent, or the existing README if present

## Validation targets

The repository should prove that:

- `npm run build` succeeds
- the generated `dist/index.html` no longer uses root-relative built asset URLs
- the deploy workflow points at the correct build output directory
- the deploy workflow runs `npm ci` and `npm run build` before artifact upload
- the deploy workflow uses the standard Pages permissions and deployment environment
- the built app remains functional when served from a repository subpath, not only from the domain root
- no existing tests regress as a result of the configuration changes

## Non-goals

- changing the app runtime behavior beyond deployment compatibility
- introducing a custom domain setup
- adding branch-based legacy Pages publishing via `gh-pages` or `docs/`
- hardcoding the repository name into the Vite config unless a later constraint requires it
