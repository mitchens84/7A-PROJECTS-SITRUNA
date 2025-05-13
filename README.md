# Interactive Content App

This project provides a modular, vanilla JavaScript–based framework for creating a wide variety of interactive content—including simple examples, dashboards, quizzes, games, and full websites—using HTML, CSS, D3.js, and Three.js. It is designed for easy deployment to GitHub Pages or Netlify.

## Phase 1: Foundational Setup (Simple & Extensible)

1. Project structure  
   ```
   /
   ├── index.html
   ├── css/
   │   └── style.css
   ├── js/
   │   ├── main.js
   │   └── modules/
   ├── assets/
   │   ├── images/
   │   └── data/
   └── content/
       ├── simple-example/
       │   ├── index.html
       │   ├── script.js
       │   └── style.css
       └── proposal/
           ├── index.html
           ├── dist/
           ├── package.json
           ├── tsconfig.json
           ├── vite.config.ts
           └── src/
               ├── main.tsx
               ├── AIWorkflowProposal.tsx
               ├── index.css
               └── global.d.ts
   ```

2. Core files  
   - **`index.html`**: Landing page with basic password prompt and navigation  
   - **`css/style.css`**: Global resets and utilities  
   - **`js/main.js`**: Global logic or navigation helpers  

3. Library integration via CDN  
   - D3.js: `<script src="https://d3js.org/d3.v7.min.js"></script>`  
   - Three.js: `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`

4. Simple example  
   A self-contained content piece in `content/simple-example/` demonstrating basic interactivity.

## Phase 2: Enhance & Scale

- Introduce a build tool (Vite) for React/TSX content.  
- Create reusable JS modules in **`js/modules/`**.  
- Optionally add client-side routing for an SPA experience.

## Phase 3: Content Creation & Deployment

1. **Proposal Module (React + TSX)**  
   - Navigate into `content/proposal/`  
   - Install dependencies:  
     ```
     cd content/proposal
     npm install
     ```  
   - Build static files:  
     ```
     npm run build
     ```  
   - This outputs to `content/proposal/dist/`. The GitHub Pages site will serve `content/proposal/dist/index.html`.

2. **Other content**  
   - Interactive Dashboards, Quizzes, Games—add under `content/` as needed.

3. **Deployment**  
   - Commit all files (including `content/proposal/dist/`).  
   - Push to GitHub. GitHub Pages will publish the site, including the proposal module.

---

> Note: The root `index.html` includes a simple JS password prompt (`password123`) to prevent unauthorized access. For stronger protection, consider hosting on Netlify and using their password-protect feature or implementing an OAuth flow.
