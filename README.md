# 7A Projects - Interactive Content App

This repository hosts a modular React-based application powered by Vite and TypeScript. It dynamically loads standalone content modules (React components or HTML pages) via a declarative configuration in each module's `module.config.ts`.

## Quick Start

1. Install dependencies:
   ```bash
   cd 7A-PROJECTS-SITRUNA
   npm install
   ```

2. Generate the content registry:
   ```bash
   npm run update-content
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run serve
   ```

## Features

- **Dynamic Content Loading**: Automatically loads content modules from configuration
- **Authentication**: Simple client-side password protection (default: "password123") with logout functionality
- **Collapsible TOC**: Table of contents in the upper-right corner that can be expanded or collapsed
- **Category Organization**: Group content by categories for better organization
- **Responsive Design**: Adapts to different screen sizes with mobile-friendly navigation
- **Multiple Content Types**: Supports both React components and HTML pages via iframe
- **Accessibility**: Enhanced keyboard navigation and ARIA attributes

## Project Structure

```text
7A-PROJECTS-SITRUNA/
├── content/                   # Static assets and module folders
│   └── simple-example/
│       ├── index.html         # Example HTML content
│       └── module.config.ts   # Module configuration
├── data/                      # Data files and scripts
│   └── index.ts               # Data exports
├── src/                       # React application source
│   ├── DirectAuthApp.tsx      # Main app with authentication and routing
│   ├── ContentRenderer.tsx    # Renders iframe or React components
│   ├── content-registry.ts    # Auto-generated registry
│   ├── components/            # Reusable UI components
│   │   ├── CollapsibleTOC.tsx # Collapsible table of contents
│   │   └── CategoryGroups.tsx # Category grouping component
│   ├── index.css              # Tailwind base styles
│   └── main.tsx               # React entry point
├── scripts/
│   └── update-content.ts      # Generates content-registry.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.cjs
└── postcss.config.cjs
```

## Content Modules

- All modules live under the `content/` folder.
- Each module folder must include a `module.config.ts` exporting default configuration:
  ```ts
  export default {
    id: 'module-id',
    title: 'Module Title',
    path: 'module-id',
    type: 'react-component' | 'iframe',
    entryPoint: './index.html' | './Component.tsx',
    description?: 'Brief description',
    category?: 'Category Name'  // Optional category for organization
  };
  ```
- **React components** (`type: 'react-component'`) should default-export a React component.
- **HTML pages** (`type: 'iframe'`) will be rendered inside an `<iframe>`.

### Adding a New Module

1. Create a folder: `content/my-new-module/`.
2. Add your content files and `module.config.ts`.
3. Run:
   ```bash
   npm run update-content
   ```
4. Restart dev server if it's running.

## Navigation and UI Features

### Collapsible Table of Contents

The application features a collapsible Table of Contents (TOC) in the upper-right corner, which provides several benefits:

- **Space Efficiency**: Collapses to a slim vertical bar when not needed, maximizing content viewing area
- **Category View**: Toggle between flat list and category-grouped view
- **Responsive Design**: Adapts to mobile devices by moving to the bottom of the screen
- **Accessibility**: Full keyboard navigation support and ARIA attributes

### Authentication

The application includes a simple client-side authentication system:

- **Password Protection**: Default password is "password123"
- **Session Persistence**: Authentication status is stored in localStorage
- **Logout Functionality**: Easily log out using the button in the top-right corner

### Keyboard Navigation

Enhanced accessibility with keyboard navigation:

- **Tab Navigation**: All interactive elements can be accessed via keyboard
- **Enter Key Support**: Enter key can trigger button actions
- **ARIA Attributes**: Proper ARIA attributes for screen readers

## Working with Data in Content Modules

The application supports various ways to work with data in your content modules:

### 1. Local Data Files

You can include data directly in your module folder or import from the central `data/` directory:

```typescript
// For local data inside your module
import localData from './data.json';

// For shared data from the data directory
import { sharedData } from '../../data';
```

### 2. Fetching External Data

For content modules that need to fetch external data:

```javascript
// In React components
import { useState, useEffect } from 'react';

function MyDataComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (/* render your component */);
}
```

### 3. Airtable Data Integration

To generate data from Airtable for use in modules, use the provided Airtable workflow extractor:

```bash
# From the root directory
python ../airtable_workflow_extractor.py --base-id YOUR_AIRTABLE_BASE_ID --table-id YOUR_AIRTABLE_TABLE_ID --output data/your_data_file.json
```

Then import the generated data in your module:

```typescript
import airtableData from '../../data/your_data_file.json';
```

### 4. Data Types

To ensure type safety when working with data, define TypeScript interfaces:

```typescript
// In your module or in data/index.ts
export interface DataItem {
  id: string;
  title: string;
  description?: string;
  // Add other properties
}

// Then use the interface
import { DataItem } from '../../data';
const items: DataItem[] = /* your data */;
```

## Storage Options for Content Modules

For modules that need to save user data or preferences:

### 1. Browser LocalStorage

```javascript
// Save data
const saveData = (key, data) => {
  localStorage.setItem(`my-module-${key}`, JSON.stringify(data));
};

// Load data
const loadData = (key, defaultValue = null) => {
  const data = localStorage.getItem(`my-module-${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

// Clear data
const clearData = (key) => {
  localStorage.removeItem(`my-module-${key}`);
};
```

### 2. For React Modules: Custom Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const prefixedKey = `my-module-${key}`;
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
}
```

Usage in components:
```javascript
import { useLocalStorage } from './hooks/useLocalStorage';

function MyComponent() {
  const [preferences, setPreferences] = useLocalStorage('preferences', { theme: 'light' });
  
  return (/* component JSX */);
}
```

## Deployment

1. Build static assets:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to GitHub Pages, Netlify, or any static host.

## Troubleshooting

### Build and Configuration Issues

#### Module System Issues

If you encounter errors related to ES modules vs CommonJS:

1. **CJS/ESM Conflict**
   - Problem: `require is not defined` or `__dirname is not defined` errors
   - Solution: Use ES module syntax consistently:
   ```javascript
   // Instead of CommonJS:
   const path = require('path');
   
   // Use ES Modules:
   import path from 'path';
   import { fileURLToPath } from 'url';
   const __dirname = path.dirname(fileURLToPath(import.meta.url));
   ```

2. **PostCSS Config Issues**
   - Problem: PostCSS or Tailwind errors during build
   - Solution: Use `.cjs` extension for PostCSS and Tailwind configs if your project uses ES modules

#### Github Pages Deployment Issues

1. **Base URL Configuration**
   - Problem: Assets and links broken on GitHub Pages
   - Solution: Update `vite.config.ts` to include the proper base path:
   ```typescript
   export default defineConfig({
     base: process.env.NODE_ENV === 'production' ? '/7A-PROJECTS-SITRUNA/' : '/',
     // ...other config
   });
   ```

2. **Path Resolution in Deployed Content**
   - Problem: Content modules with hardcoded paths fail to load
   - Solution: Use `import.meta.env.BASE_URL` for all asset paths:
   ```jsx
   <img src={`${import.meta.env.BASE_URL}assets/image.png`} />
   ```

### Content Module Issues

1. **Module Not Showing in Navigation**
   - Problem: New module doesn't appear in the sidebar
   - Solutions: 
     - Ensure module.config.ts is properly formatted
     - Run `npm run update-content` to update the registry
     - Restart the dev server

2. **Content Loads But Styling is Missing**
   - Problem: Content appears unstyled in iframe mode
   - Solution: Ensure your module's CSS is being loaded correctly:
   ```html
   <!-- In your module's index.html -->
   <link rel="stylesheet" href="./style.css">
   ```

3. **Interactive Elements Not Working in iframes**
   - Problem: Buttons or interactive elements in iframe content don't work
   - Solution: Ensure JS is included in the iframe document:
   ```html
   <!-- At the end of your module's index.html -->
   <script src="./script.js"></script>
   ```

### React Component Issues

1. **Component Fails to Load**
   - Problem: React component module shows error or blank screen
   - Solution: Check that your component has a proper default export:
   ```typescript
   // In your Component.tsx
   const MyComponent = () => {
     return <div>My Component</div>;
   };
   
   export default MyComponent;
   ```

2. **Type Errors During Build**
   - Problem: TypeScript type errors prevent building
   - Solution: Fix type issues or use type assertions where appropriate:
   ```typescript
   // For interface implementation
   interface Props {
     data: string[];
   }
   
   const MyComponent: React.FC<Props> = ({ data }) => {
     return <div>{data.map(item => <div key={item}>{item}</div>)}</div>;
   };
   ```

## License

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.
