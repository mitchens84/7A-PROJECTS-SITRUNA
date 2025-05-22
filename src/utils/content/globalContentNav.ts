/**
 * Global content navigation utility that provides search capabilities 
 * across all content in the system.
 */

import { 
  loadKnowledgeMapData, 
  loadWorkflowProposal, 
  getAvailableWorkflowProposals,
  getAvailableStaticPages
} from './contentLoader';

// Define the search result interface
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'map-node' | 'workflow-section' | 'static-page';
  path: string;
  relevance: number;
}

/**
 * Search across all content in the system
 */
export async function globalContentSearch(query: string): Promise<SearchResult[]> {
  const searchTerm = query.toLowerCase();
  const results: SearchResult[] = [];
  
  // Don't search if query is too short
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  try {
    // 1. Search in knowledge map
    const knowledgeMapData = await loadKnowledgeMapData();
    
    // Search in nodes
    for (const node of knowledgeMapData.nodes) {
      const nodeContent = `${node.label} ${node.description} ${node.details.purpose} ${node.details.implementation} ${node.details.components.join(' ')}`.toLowerCase();
      const matchIndex = nodeContent.indexOf(searchTerm);
      
      if (matchIndex !== -1) {
        // Calculate relevance score based on where match occurred and how much of the content matched
        const relevance = calculateRelevance(nodeContent, searchTerm, matchIndex);
        
        results.push({
          id: node.id,
          title: node.label,
          description: node.description,
          content: nodeContent,
          type: 'map-node',
          path: `/knowledge-map?node=${node.id}`,
          relevance
        });
      }
    }
    
    // 2. Search in workflow proposals
    const proposalsList = await getAvailableWorkflowProposals();
    
    for (const proposal of proposalsList) {
      const proposalData = await loadWorkflowProposal(proposal.id);
      
      // Search in proposal metadata
      const metadataContent = `${proposalData.title} ${proposalData.description} ${proposalData.author}`.toLowerCase();
      let matchIndex = metadataContent.indexOf(searchTerm);
      
      if (matchIndex !== -1) {
        const relevance = calculateRelevance(metadataContent, searchTerm, matchIndex);
        
        results.push({
          id: proposal.id,
          title: proposalData.title,
          description: proposalData.description,
          content: metadataContent,
          type: 'workflow-section',
          path: `/workflow-proposal/${proposal.id}`,
          relevance
        });
      }
      
      // Search in proposal sections
      for (const section of proposalData.sections) {
        const sectionContent = `${section.title} ${section.content}`.toLowerCase();
        matchIndex = sectionContent.indexOf(searchTerm);
        
        if (matchIndex !== -1) {
          const relevance = calculateRelevance(sectionContent, searchTerm, matchIndex);
          
          results.push({
            id: `${proposal.id}-${section.id}`,
            title: `${proposalData.title}: ${section.title}`,
            description: section.content.substring(0, 120) + '...',
            content: sectionContent,
            type: 'workflow-section',
            path: `/workflow-proposal/${proposal.id}#${section.id}`,
            relevance
          });
        }
      }
    }
    
    // 3. Search in static pages
    const staticPagesList = await getAvailableStaticPages();
    
    for (const page of staticPagesList) {
      try {
        // We might need to handle HTML properly here, but for now just do basic text search
        const pageContent = await fetch(`/content/static-pages/${page.id}.html`).then(res => res.text());
        const lowerContent = pageContent.toLowerCase();
        const matchIndex = lowerContent.indexOf(searchTerm);
        
        if (matchIndex !== -1) {
          const relevance = calculateRelevance(lowerContent, searchTerm, matchIndex);
          
          results.push({
            id: page.id,
            title: page.title,
            description: extractContextAroundMatch(lowerContent, searchTerm, matchIndex),
            content: lowerContent,
            type: 'static-page',
            path: `/static-page/${page.id}`,
            relevance
          });
        }
      } catch (error) {
        console.error(`Error searching static page ${page.id}:`, error);
      }
    }
    
    // Sort results by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

/**
 * Calculate search result relevance score based on match position and content size
 */
function calculateRelevance(content: string, searchTerm: string, matchPosition: number): number {
  // Base score
  let score = 100;
  
  // The earlier the match occurs, the more relevant it is
  const positionFactor = 1 - (matchPosition / content.length);
  score += positionFactor * 50;
  
  // Longer matches are more relevant
  const lengthFactor = searchTerm.length / Math.min(20, content.length);
  score += lengthFactor * 30;
  
  // Exact matches are more relevant than partial matches
  const words = content.split(/\s+/);
  if (words.includes(searchTerm)) {
    score += 20;
  }
  
  // Match in the title or at the beginning of a word is more relevant
  const wordBoundaryRegex = new RegExp(`\\b${searchTerm}`, 'i');
  if (wordBoundaryRegex.test(content)) {
    score += 10;
  }
  
  return score;
}

/**
 * Extract a snippet of text around the search match
 */
function extractContextAroundMatch(content: string, searchTerm: string, matchPosition: number): string {
  const contextSize = 60; // Characters on either side of the match
  const start = Math.max(0, matchPosition - contextSize);
  const end = Math.min(content.length, matchPosition + searchTerm.length + contextSize);
  
  let snippet = content.substring(start, end);
  
  // Add ellipsis if we're not at the beginning or end
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < content.length) {
    snippet += '...';
  }
  
  return snippet;
}
