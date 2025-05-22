# SITRUNA Documentation Enhancement Plan

This document outlines the plan for improving and expanding the documentation for the SITRUNA project.

## Documentation Structure

The documentation will be organized into the following sections:

1. **Getting Started**
   - Project Overview
   - Prerequisites
   - Installation
   - Configuration
   - Running the Project

2. **Developer Guide**
   - Project Architecture
   - Component Library
   - Content Management
   - Authentication
   - State Management
   - Routing
   - Styling

3. **Content Authoring Guide**
   - Content Types
   - Content Schema
   - Authoring Workflow
   - Content Validation
   - Content Publishing

4. **API Reference**
   - Content API
   - Authentication API
   - Utility Functions
   - Component Props

5. **Troubleshooting Guide**
   - Common Issues
   - Error Handling
   - Debugging Tips

## Implementation Plan

### 1. Project Documentation

#### README.md (Project Root)
- Provide a concise project overview
- Include setup instructions
- List key features
- Link to detailed documentation

#### docs/ARCHITECTURE.md
```markdown
# SITRUNA Architecture

## Overview

SITRUNA is a single-page application built with React and TypeScript. It follows a hybrid architecture that combines a React frontend with a static content management system.

## Key Architecture Decisions

### Hybrid Content Management
The project uses a hybrid approach for content management:
- React components for interactive features
- Static JSON files for content
- Static HTML for simple pages

### Component Structure
The component hierarchy is organized as follows:
- Layouts: Define page structure
- Features: Group related components by feature
- Components: Reusable UI elements
- Pages: Top-level page components

### Routing Strategy
The application uses react-router-dom for routing with:
- Public routes for unauthenticated access
- Protected routes requiring authentication
- Static routes for EXPRESS content

### State Management
State management is handled through:
- React Context for global state (auth, search)
- Component state for local UI state
- localStorage/sessionStorage for persistent state

## Directory Structure

[Detailed explanation of directory structure]

## Data Flow

[Diagram and explanation of data flow]

## Build Process

[Explanation of build process]
```

#### docs/COMPONENT_LIBRARY.md
```markdown
# Component Library

## Overview
This document provides detailed information about the reusable components in the SITRUNA project.

## Components

### Breadcrumbs
**Path:** `src/components/Breadcrumbs.tsx`

**Description:**  
Component for displaying navigation breadcrumbs.

**Props:**
- `paths`: Array of path segments
- `onNavigate`: Function called when a breadcrumb is clicked

**Usage Example:**
```tsx
<Breadcrumbs 
  paths={[
    { label: 'Home', path: '/' },
    { label: 'Knowledge Map', path: '/knowledge-map' }
  ]} 
  onNavigate={(path) => navigate(path)}
/>
```

### GlobalSearch
**Path:** `src/components/GlobalSearch.tsx`

**Description:**  
Modal component for searching across all content.

**Props:**
- `isOpen`: Boolean to control visibility
- `onClose`: Function called when the modal is closed

**Usage Example:**
```tsx
<GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
```

[Continue documenting each component...]
```

### 2. Content Authoring Documentation

#### docs/CONTENT_AUTHORING_GUIDE.md
```markdown
# Content Authoring Guide

## Overview
This guide explains how to create and manage content in the SITRUNA project.

## Content Types

### Knowledge Map
Knowledge maps represent interconnected concepts or components.

**Schema:**
```json
{
  "nodes": [
    {
      "id": "string",
      "label": "string",
      "description": "string",
      "details": {
        "purpose": "string",
        "implementation": "string",
        "components": ["string"]
      }
    }
  ],
  "edges": [
    {
      "source": "string",
      "target": "string",
      "label": "string"
    }
  ]
}
```

**File Location:**
`/content/knowledge-map/data.json`

### Workflow Proposal
Workflow proposals describe processes or procedures.

**Schema:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "sections": [
    {
      "title": "string",
      "content": "string"
    }
  ],
  "metadata": {
    "author": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**File Location:**
`/content/workflow-proposals/{id}.json`

[Continue documenting each content type...]

## Authoring Workflow

1. **Create Content**
   - Create a new JSON file in the appropriate content directory
   - Follow the schema for the content type
   - Include all required fields

2. **Validate Content**
   - Run `npm run validate-content` to check for schema errors
   - Fix any validation errors

3. **Preview Content**
   - Run `npm run dev` to start the development server
   - Navigate to the appropriate page to preview your content

4. **Publish Content**
   - Commit your changes to the repository
   - Push to the main branch
   - The content will be included in the next build

## Best Practices

- Use descriptive IDs for content items
- Include comprehensive metadata
- Follow consistent formatting
- Add cross-references between related content
- Keep content focused and concise
```

### 3. API Documentation

#### docs/API_REFERENCE.md
```markdown
# API Reference

## Content API

### contentLoader.ts

#### `loadKnowledgeMapData()`
Loads knowledge map data from the content directory.

**Returns:** Promise<KnowledgeMapData | null>

**Example:**
```typescript
import { loadKnowledgeMapData } from './utils/content/contentLoader';

async function fetchData() {
  const mapData = await loadKnowledgeMapData();
  if (mapData) {
    // Use mapData
  }
}
```

#### `loadWorkflowProposal(id: string)`
Loads a specific workflow proposal by ID.

**Parameters:**
- `id`: string - The ID of the workflow proposal

**Returns:** Promise<WorkflowProposal | null>

**Example:**
```typescript
import { loadWorkflowProposal } from './utils/content/contentLoader';

async function fetchProposal(id: string) {
  const proposal = await loadWorkflowProposal(id);
  if (proposal) {
    // Use proposal
  }
}
```

[Continue documenting each API function...]

## Authentication API

### authService.ts

#### `login(password: string)`
Authenticates a user with the given password.

**Parameters:**
- `password`: string - The password to validate

**Returns:** Promise<boolean>

**Example:**
```typescript
import { login } from './features/auth/authService';

async function handleLogin(password: string) {
  const success = await login(password);
  if (success) {
    // User is authenticated
  } else {
    // Authentication failed
  }
}
```

[Continue documenting authentication API...]
```

### 4. Troubleshooting Guide

#### docs/TROUBLESHOOTING.md
```markdown
# Troubleshooting Guide

## Common Issues

### Content Not Loading

**Symptoms:**
- Blank page where content should appear
- Error message: "Failed to load content"
- Console errors related to fetch requests

**Possible Causes:**
1. Content file is missing
2. Content file has JSON syntax errors
3. Content schema doesn't match expected format
4. CORS issues in development environment

**Solutions:**
1. Check that the content file exists in the correct location
2. Validate the JSON syntax using a JSON validator
3. Compare the content with the expected schema
4. Run the application using `npm run dev` instead of opening the HTML file directly

### Authentication Issues

**Symptoms:**
- Unable to log in despite using correct password
- "Access Denied" errors
- Being redirected to login page repeatedly

**Possible Causes:**
1. Environment variable for password hash is not set correctly
2. Session storage is being cleared unexpectedly
3. Protected route configuration issue

**Solutions:**
1. Check `.env.local` file for correct `VITE_APP_PASSWORD_HASH` value
2. Verify that sessionStorage is working correctly in your browser
3. Check the `ProtectedRoute` component implementation

[Continue documenting common issues and solutions...]

## Debugging Tips

### React DevTools
Use React DevTools to inspect component state and props:
1. Install the React DevTools browser extension
2. Open browser developer tools (F12)
3. Navigate to the "Components" or "Profiler" tab
4. Select components to view their props and state

### Network Debugging
To debug content loading issues:
1. Open browser developer tools (F12)
2. Go to the "Network" tab
3. Filter by "Fetch/XHR"
4. Look for failed requests to content files
5. Check the response status and body

### TypeScript Errors
For TypeScript compilation errors:
1. Run `npm run typecheck` to see all type errors
2. Check the error location and message
3. Fix type issues according to the error messages
4. Use explicit typing when TypeScript can't infer types

[Continue with more debugging tips...]
```

## Implementation Timeline

1. **Week 1**: Create basic structure and README updates
2. **Week 2**: Develop architecture and component documentation
3. **Week 3**: Create content authoring guide
4. **Week 4**: Develop API reference documentation
5. **Week 5**: Create troubleshooting guide
6. **Week 6**: Review, revise, and finalize all documentation
