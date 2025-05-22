# SITRUNA Performance Optimization Plan

This document outlines strategies and techniques to optimize the performance of the SITRUNA project.

## Current Performance Analysis

Before implementing optimizations, we should measure the current performance to establish a baseline:

1. **Metrics to Measure**:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Total Bundle Size
   - Component Render Times
   - API/Content Loading Times

2. **Tools for Measurement**:
   - Lighthouse
   - Chrome DevTools Performance Tab
   - React DevTools Profiler
   - `web-vitals` library for real-user monitoring

## Bundle Size Optimization

### 1. Code Splitting

Implement code splitting to reduce the initial bundle size:

```typescript
// In App.tsx or appRoutes.ts
import { lazy, Suspense } from 'react';

// Instead of:
// import KnowledgeMapPage from './pages/SitrunaKnowledgeMap';

// Use:
const KnowledgeMapPage = lazy(() => import('./pages/SitrunaKnowledgeMap'));

// In your route definitions:
{
  path: '/knowledge-map',
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <KnowledgeMapPage />
    </Suspense>
  )
}
```

### 2. Tree Shaking Verification

Ensure that tree shaking is working properly:

- Review import statements to use named imports where possible
- Check for side effects in imported modules
- Verify that the build output doesn't include unused code

### 3. Dependencies Audit

Audit and optimize third-party dependencies:

```bash
# Use npm's built-in audit feature
npm audit

# Analyze bundle size
npx bundle-analyzer
```

## Rendering Optimization

### 1. Component Memoization

Apply memoization to expensive components:

```typescript
import { memo, useMemo } from 'react';

// Memoize components that don't need frequent re-renders
const ExpensiveComponent = memo(({ data }) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const SomeComponent = ({ items }) => {
  const processedItems = useMemo(() => {
    return items.map(item => expensiveProcessing(item));
  }, [items]);
  
  return (/* Render using processedItems */);
};
```

### 2. Virtualization for Long Lists

Implement virtualization for the knowledge map nodes and search results:

```typescript
// Install react-window
// npm install react-window

import { FixedSizeList } from 'react-window';

const VirtualizedList = ({ items }) => {
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].title}
        </div>
      )}
    </FixedSizeList>
  );
};
```

### 3. Reduce Unnecessary Re-renders

- Use the React DevTools Profiler to identify components that re-render unnecessarily
- Apply `React.memo()` strategically
- Refactor context providers to prevent unnecessary context updates

## Content Loading Optimization

### 1. Content Caching

Implement a caching system for loaded content:

```typescript
// src/utils/content/contentCache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class ContentCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  
  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const contentCache = new ContentCache();
```

Update the content loader to use the cache:

```typescript
// In contentLoader.ts
import { contentCache } from './contentCache';

export async function loadKnowledgeMapData(): Promise<KnowledgeMapData | null> {
  const cacheKey = 'knowledge-map-data';
  const cachedData = contentCache.get<KnowledgeMapData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await fetch('/content/knowledge-map/data.json');
    if (!response.ok) throw new Error('Failed to load knowledge map data');
    const data = await response.json();
    contentCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error loading knowledge map data:', error);
    return null;
  }
}
```

### 2. Content Preloading

Implement preloading for frequently accessed content:

```typescript
// src/utils/content/contentPreloader.ts
export function preloadFrequentContent(): void {
  // Preload content that is frequently accessed
  Promise.all([
    loadKnowledgeMapData(),
    getAvailableWorkflowProposals(),
    // Other frequently accessed content
  ]).catch(error => {
    console.error('Error preloading content:', error);
  });
}

// Call in App.tsx after initial render
useEffect(() => {
  preloadFrequentContent();
}, []);
```

### 3. Content Bundling

For related content that is often accessed together, create bundled endpoints:

```typescript
// Example: Create a bundle endpoint for the knowledge map page
// /content/bundles/knowledge-map-bundle.json
// Which includes knowledge map data + related workflow proposals

export async function loadKnowledgeMapBundle(): Promise<{
  mapData: KnowledgeMapData;
  relatedWorkflows: WorkflowProposal[];
} | null> {
  try {
    const response = await fetch('/content/bundles/knowledge-map-bundle.json');
    if (!response.ok) throw new Error('Failed to load knowledge map bundle');
    return await response.json();
  } catch (error) {
    console.error('Error loading knowledge map bundle:', error);
    return null;
  }
}
```

## Image Optimization

### 1. Responsive Images

Use responsive images with appropriate sizes:

```html
<img 
  src="small.jpg"
  srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w"
  sizes="(max-width: 600px) 500px, (max-width: 1200px) 1000px, 1500px"
  alt="Description"
  loading="lazy"
/>
```

### 2. Image Lazy Loading

Implement lazy loading for images that are below the fold:

```typescript
import { useEffect, useRef, useState } from 'react';

const LazyImage = ({ src, alt }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ''}
      data-src={src}
      alt={alt}
      className={`lazy-image ${isVisible ? 'loaded' : ''}`}
    />
  );
};
```

## CSS Optimization

### 1. Critical CSS

Extract and inline critical CSS:

```typescript
// Install critical
// npm install critical

// In your build script:
const critical = require('critical');

critical.generate({
  base: 'dist/',
  src: 'index.html',
  target: {
    html: 'index.html',
    css: 'critical.css',
  },
  width: 1300,
  height: 900,
  inline: true,
});
```

### 2. CSS Purging

Remove unused CSS:

```bash
# Install PurgeCSS
npm install --save-dev @fullhuman/postcss-purgecss

# Update postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' && require('@fullhuman/postcss-purgecss')({
      content: [
        './src/**/*.tsx',
        './src/**/*.ts',
        './src/**/*.jsx',
        './src/**/*.js',
        './public/**/*.html',
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    })
  ]
}
```

## Implementation Timeline

1. **Week 1**: Performance analysis and benchmarking
2. **Week 2**: Bundle optimization and code splitting
3. **Week 3**: Content loading optimizations and caching
4. **Week 4**: Component-level optimizations and UI performance improvements
5. **Week 5**: Image and CSS optimizations
6. **Week 6**: Final testing and performance verification
