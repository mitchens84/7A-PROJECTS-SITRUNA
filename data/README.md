# Sitruna Data Structure

This directory contains all data sources for the Sitruna applications. The data is organized in a modular structure where each type of data has its own subdirectory.

## Directory Structure

```
/data
├── index.ts           # Main entry point that exports all data
├── knowledge/         # Knowledge data from Airtable
│   └── index.ts       # Exports knowledge data and types
└── ... (future data sources)
```

## Usage

### Importing Data

You can import data from specific modules:

```typescript
// Import from a specific data module
import { knowledgeData, filterByCategory } from '../data/knowledge';

// Or import from the main data entry point
import { knowledgeData, filterByCategory } from '../data';
```

### Adding New Data Sources

To add a new data source:

1. Create a new directory for your data type (e.g., `/data/clients/`)
2. Create an `index.ts` file in that directory that exports your data and types
3. Update the main `/data/index.ts` file to re-export your data

## Available Data Sources

### Knowledge Data

Data imported from the Airtable base "7A-PROJECTS-SITRUNA" table "KNOWLEGE_UPDATED". 

This data contains information about:
- Marketplace policies
- Listing management
- Inventory and fulfillment
- Case management
- Client information
- Internal operations
- Team communication

Helper functions available:
- `filterByCategory(category)`
- `filterByTool(tool)`
- `filterByTeam(team)`
- `filterByType(type)`
- `filterByDataStructure(structure)`
