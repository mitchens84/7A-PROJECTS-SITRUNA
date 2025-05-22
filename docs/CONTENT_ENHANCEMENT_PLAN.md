# SITRUNA Content Enhancement Plan

This document outlines the next steps for enhancing the content structure in the SITRUNA project.

## Content Type Schemas

### 1. Knowledge Base Articles

Create a new content type for knowledge base articles:

```typescript
// src/types/ContentTypes.ts
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  relatedArticles: string[]; // IDs of related articles
  category: string;
  summary: string;
}
```

Content directory structure:
```
/content/knowledge-base/
  article-1.json
  article-2.json
  ...
```

### 2. Tutorials

Create a new content type for step-by-step tutorials:

```typescript
// src/types/ContentTypes.ts
export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  prerequisites: string[]; // IDs of prerequisite tutorials or knowledge base articles
  steps: {
    title: string;
    content: string;
    image?: string;
  }[];
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
}
```

Content directory structure:
```
/content/tutorials/
  tutorial-1.json
  tutorial-2.json
  ...
```

### 3. Reference Documentation

Create a new content type for reference documentation:

```typescript
// src/types/ContentTypes.ts
export interface ReferenceDoc {
  id: string;
  title: string;
  slug: string;
  version: string;
  content: string;
  apiEndpoints?: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
    parameters: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    responses: {
      code: number;
      description: string;
      example: string;
    }[];
  }[];
  author: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}
```

Content directory structure:
```
/content/reference/
  reference-1.json
  reference-2.json
  ...
```

## Content Metadata

Implement a consistent metadata structure across all content types:

```typescript
// src/types/ContentMetadata.ts
export interface ContentMetadata {
  id: string;
  type: 'knowledge-map' | 'workflow-proposal' | 'static-page' | 'knowledge-base' | 'tutorial' | 'reference';
  title: string;
  slug: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'protected';
}
```

## Content Relationships

Implement a system for defining relationships between content items:

```typescript
// src/types/ContentRelationships.ts
export type RelationshipType = 'prerequisite' | 'related' | 'next' | 'previous' | 'parent' | 'child';

export interface ContentRelationship {
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  description?: string;
}

// Store relationships in a separate file
// /content/relationships.json
```

## Content Loader Enhancements

Enhance the content loader to support the new content types:

```typescript
// src/utils/content/contentLoader.ts

// Existing functions...

// New functions for loading knowledge base articles
export async function loadKnowledgeBaseArticle(id: string): Promise<KnowledgeBaseArticle | null> {
  try {
    const response = await fetch(`/content/knowledge-base/${id}.json`);
    if (!response.ok) throw new Error(`Failed to load knowledge base article: ${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error loading knowledge base article:', error);
    return null;
  }
}

export async function getAvailableKnowledgeBaseArticles(): Promise<string[]> {
  try {
    const response = await fetch('/content/knowledge-base/index.json');
    if (!response.ok) throw new Error('Failed to load knowledge base index');
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error loading knowledge base index:', error);
    return [];
  }
}

// Similar functions for tutorials and reference docs...

// Function to get content relationships
export async function getContentRelationships(contentId: string): Promise<ContentRelationship[]> {
  try {
    const response = await fetch('/content/relationships.json');
    if (!response.ok) throw new Error('Failed to load relationships');
    const data = await response.json();
    return data.relationships.filter(
      (rel: ContentRelationship) => rel.sourceId === contentId || rel.targetId === contentId
    );
  } catch (error) {
    console.error('Error loading relationships:', error);
    return [];
  }
}
```

## Content Indexing for Search

Create an indexing system to improve search performance:

```typescript
// src/utils/content/contentIndexer.ts
import { SearchResult } from './globalContentNav';

interface ContentIndex {
  [key: string]: {
    title: string;
    description: string;
    content: string;
    type: string;
    path: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
}

let contentIndex: ContentIndex | null = null;

export async function buildContentIndex(): Promise<void> {
  // Load all content and build index
  // This would be called on app initialization
}

export function searchContentIndex(query: string): SearchResult[] {
  // Search the index and return results
}
```

## Implementation Steps

1. Create the new type definitions in `src/types/`
2. Update the content loader with functions for the new content types
3. Create example content files for each new type
4. Update the global search to include the new content types
5. Add UI components for displaying the new content types
6. Implement the relationship visualization
7. Create an admin interface for managing content (optional)

## Timeline

- Week 1: Define schemas and create type definitions
- Week 2: Implement content loader enhancements and create example content
- Week 3: Update search and UI components
- Week 4: Implement relationship visualization and testing
