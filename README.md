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
       └── simple-example/
           ├── index.html
           ├── script.js
           └── style.css
   ```

2. Core files  
   - **`index.html`**: Landing page and navigation hub  
   - **`css/style.css`**: Global resets and utilities  
   - **`js/main.js`**: Global logic or navigation helpers  
   - **`js/modules/`**: Reusable components

3. Library integration via CDN  
   - D3.js: `<script src="https://d3js.org/d3.v7.min.js"></script>`  
   - Three.js: `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`

4. Simple example  
   A self-contained content piece in `content/simple-example/` demonstrating basic interactivity.

## Phase 2: Enhancements & Scaling (Optional)

- Introduce a bundler/build tool (Vite or Parcel) for ES6 modules and local dependencies.  
- Create reusable JS modules in **`js/modules/`**.  
- Optionally add client-side routing for an SPA experience.

## Phase 3: Content Creation & Deployment

1. Build various content types under `content/` (dashboards, websites, quizzes, games).  
2. Deploy to GitHub Pages (root/`main`) or Netlify (connect repo, configure build/publish settings).

---

Once you’re ready, I will begin implementing Phase 1: creating the directory structure and core boilerplate files.
