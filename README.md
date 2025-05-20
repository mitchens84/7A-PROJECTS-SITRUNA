# 7A-PROJECTS-SITRUNA

Frontend platform for hosting static sites and interactive React components. This project adheres to the guidelines in the `COMPREHENSIVE_FRONTEND_GUIDE.md` and `PROJECT_BRIEF_TEMPLATE.md` found in the parent `PAGES` repository.

## Project Structure

-   **`EXPRESS/`**: Contains standalone static HTML sites and content. Each subdirectory is a separate site/section.
-   **`src/`**: Contains the React application source code.
    -   **`assets/`**: Static assets like CSS, images for the React app.
    -   **`components/`**: Reusable React components (e.g., `CollapsibleTOC`, `ProtectedRoute`).
    -   **`features/`**: Feature-specific modules (e.g., `auth`, `career` for the proposal page).
    -   **`hooks/`**: Custom React hooks (e.g., `usePersistentState`).
    -   **`layouts/`**: Layout components for different page structures.
    -   **`pages/`**: Top-level page components mapped to routes.
    -   **`services/`**: Services like authentication logic.
    -   **`utils/`**: Utility functions (e.g., `localStorageUtils`).
    -   **`appRoutes.ts`**: Defines React app routes and ToC entries for these routes.
    -   **`toc-static-data.json`**: Auto-generated list of static content from `EXPRESS/` for the ToC.
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
*   **Unified Collapsible Table of Contents:** Dynamically generated from `EXPRESS/` static content and React app routes.
*   **Persistent Storage:** Using `localStorage` for form inputs and ToC state, `sessionStorage` for auth status.
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
