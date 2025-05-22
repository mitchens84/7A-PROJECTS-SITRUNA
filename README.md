# 7A-PROJECTS-SITRUNA

Frontend platform for hosting static sites and interactive React components. This project adheres to the guidelines in the `COMPREHENSIVE_FRONTEND_GUIDE.md` and `PROJECT_BRIEF_TEMPLATE.md` found in the parent `PAGES` repository.

## Project Structure

-   **`EXPRESS/`**: Contains standalone static HTML sites and content. Each subdirectory is a separate site/section.
    -   **`knowledge-map/`**: Interactive D3.js based knowledge map.
    -   **`workflow-proposal/`**: Dynamically rendered workflow proposal.
    -   **`data-visualization/`**: Chart visualization page.
    -   *(Other static content directories as needed)*
-   **`src/`**: Contains the React application source code.
    -   **`assets/`**: Static assets like CSS, images for the React app.
    -   **`components/`**: Reusable React components (e.g., `CollapsibleTOC`, `ProtectedRoute`).
    -   **`features/`**: Feature-specific modules (e.g., `auth`, `career` for the proposal page).
    -   **`hooks/`**: Custom React hooks (e.g., `usePersistentState`).
    -   **`layouts/`**: Layout components for different page structures.
    -   **`pages/`**: Top-level page components mapped to routes.
    -   **`services/`**: Services like authentication logic.
    -   **`utils/`**: Utility functions (e.g., `localStorageUtils`).
    -   **`utils/content/contentLoader.js`**: Utility to load dynamic JSON data for `EXPRESS/` pages.
    -   **`appRoutes.ts`**: Defines React app routes and ToC entries for these routes.
    -   **`toc-static-data.json`**: Auto-generated list of static content from `EXPRESS/` for the ToC.
    -   **`auto-storage.js`**: Script for managing persistent storage for `EXPRESS/` pages, often used with `contentLoader.js`.
    -   **`storage-manager.js`**: Helper for `auto-storage.js` providing an API for `localStorage` and `sessionStorage`.
-   **`scripts/`**: Node.js scripts for build process tasks (e.g., `generate-static-toc.js`).
-   **`public/`**: Static assets served directly by Vite (e.g., `favicon.ico`).
-   **`PROJECT_BRIEF.md`**: Detailed project specification.
-   **`vite.config.ts`**: Vite build configuration, including `base` URL for GitHub Pages.
-   **`package.json`**: Project dependencies and scripts, including `homepage` for GitHub Pages and `generate-static-toc`.

## Development

1.  **Set up Environment Variables:**
    *   Create a `.env.local` file in the project root (`/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/.env.local`).
    *   Add your chosen password's SHA-256 hash:
        ```
        VITE_APP_PASSWORD_HASH="your_sha256_password_hash_here"
        VITE_APP_TITLE="7A Projects Sitruna"
        ```
    *   To generate a SHA-256 hash, you can use an online tool or a command-line utility. For example, in Node.js:
        ```javascript
        // In Node.js REPL or a script:
        // require('crypto').createHash('sha256').update('your_password_here').digest('hex');
        ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Generate Static Table of Contents Data (if `EXPRESS/` content exists or changes):**
    ```bash
    npm run generate-static-toc
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

6.  **TypeScript type checking:**
    ```bash
    npm run typecheck
    ```
    
7.  **Content Management:**
    - All content is stored in the `/content/` directory
    - Knowledge map data is in `/content/knowledge-map/`
    - Workflow proposals are in `/content/workflow-proposals/`
    - Data visualization data is in `/content/data-visualization/` (e.g., `chart-data.json`)
    - Static pages are in `/content/static-pages/`

## Content Architecture

The project uses a hybrid content management approach:

### 1. Content Structure

The content is organized in a hierarchical structure:
- **Content Types**: Different types of content (knowledge maps, workflow proposals, data visualizations, etc.)
- **Content Items**: Individual pieces of content within each type (e.g., `nodes-data.json` for knowledge map, `ai-workflow.json` for a specific proposal, `chart-data.json` for a visualization).
- **Content Metadata**: Information about each content item (title, description, author, etc.) - often embedded within the JSON or managed by the loading page.
- **Content Versioning**: Version history for each content item (managed via Git).

### 2. Content Loading

-   **React App**: Content for React components/pages is typically imported directly or fetched via API calls if dynamic.
-   **`EXPRESS/` Pages**:
    -   Static HTML pages in `EXPRESS/` can load dynamic data from JSON files located in the `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/content/` directory.
    -   The `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/src/utils/content/contentLoader.js` script is provided to facilitate this. It fetches and parses JSON data, making it available to the static page's JavaScript.
    -   `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/src/auto-storage.js` (and its helper `storage-manager.js`) can be used by these static pages to persist user inputs or state related to the loaded content (e.g., form data, interaction states).
    -   Data is typically fetched using paths relative to the `content/` directory, e.g., `contentLoader.fetchData('/7A-PROJECTS-SITRUNA/content/knowledge-map/nodes-data.json')`.

### 3. Navigation

The project provides multiple ways to navigate content:
- **Collapsible TOC**: Hierarchical navigation of all content
- **Breadcrumbs**: Context-aware path navigation
- **Global Search**: Search across all content types (Ctrl+K/Cmd+K)

## Authentication

This project uses a simple password-based authentication system:
- Default password is "7A-PROJECTS-SITRUNA" (configurable via environment variables)
- Authentication state is stored in `sessionStorage`
- Protected routes require authentication

## Deployment

The project is configured for deployment to GitHub Pages:
1. Build the project: `npm run build`
2. The built files will be in the `dist/` directory
3. Push the `dist/` directory to the `gh-pages` branch of your GitHub repository

## Future Enhancements

See the `PROJECT_COMPLETION_CHECKLIST.md` file for details on planned enhancements and recommendations.
    ```bash
    npm run dev
    ```
    This will typically start the Vite development server, usually on `http://localhost:5173` (or the next available port).

## Building for Production (GitHub Pages)

1.  Ensure `VITE_APP_PASSWORD_HASH` is set appropriately for production (e.g., via GitHub Secrets if your build process supports it, or ensure `.env.production.local` is correctly configured if used, though not recommended for secrets in repo).
2.  Generate the static ToC data:
    ```bash
    npm run generate-static-toc
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
    This will create a `dist/` folder with the production-ready assets.

4.  Deploy the `dist/` folder contents to your GitHub Pages site, under the `/PAGES/7A-PROJECTS-SITRUNA/` path.

## Key Features Implemented

*   **Tier 1 Client-Side Authentication:** Login page with hashed password checking.
*   **Unified Collapsible Table of Contents:** Dynamically generated from `EXPRESS/` static content (via `toc-static-data.json` updated by `npm run generate-static-toc`) and React app routes (defined in `appRoutes.ts`).
*   **Persistent Storage:**
    *   React App: Using `localStorage` for form inputs and ToC state, `sessionStorage` for auth status.
    *   `EXPRESS/` Pages: Can utilize `auto-storage.js` for `localStorage`/`sessionStorage` interactions.
*   **GitHub Pages Deployment Configuration:** `vite.config.ts` and `package.json` are pre-configured.
*   **`proposal.tsx` Integration:** Included as a dedicated page within the React application.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
