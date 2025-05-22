// Type definitions for global content navigation
declare module '../utils/content/globalContentNav' {
  export interface SearchResult {
    id: string;
    title: string;
    description: string;
    content: string;
    type: 'map-node' | 'workflow-section' | 'static-page';
    path: string;
    relevance: number;
  }

  export function globalContentSearch(query: string): Promise<SearchResult[]>;
}
