/**
 * Content loader utility that loads content from the /content directory
 */

// Define types for different content structures
export interface KnowledgeMapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'core' | 'module' | 'service' | 'external';
  description: string;
  details: {
    purpose: string;
    components: string[];
    implementation: string;
  };
}

export interface KnowledgeMapConnection {
  source: string;
  target: string;
  strength: 'strong' | 'medium' | 'weak';
}

export interface KnowledgeMapData {
  title: string;
  description: string;
  nodes: KnowledgeMapNode[];
  connections: KnowledgeMapConnection[];
}

export interface WorkflowProposalSection {
  id: string;
  title: string;
  content: string;
}

export interface WorkflowProposal {
  title: string;
  description: string;
  author: string;
  date: string;
  sections: WorkflowProposalSection[];
}

// Helper function to fetch JSON content
async function fetchJsonContent<T>(path: string): Promise<T> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.statusText}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error('Error loading content:', error);
    throw error;
  }
}

// Function to fetch HTML content
async function fetchHtmlContent(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading content:', error);
    throw error;
  }
}

// Content loader functions
export async function loadKnowledgeMapData(): Promise<KnowledgeMapData> {
  return await fetchJsonContent<KnowledgeMapData>('/content/knowledge-map/nodes-data.json');
}

export async function loadWorkflowProposal(id: string): Promise<WorkflowProposal> {
  return await fetchJsonContent<WorkflowProposal>(`/content/workflow-proposals/${id}.json`);
}

export async function loadStaticPage(id: string): Promise<string> {
  return await fetchHtmlContent(`/content/static-pages/${id}.html`);
}

// Function to get all available workflow proposals
export async function getAvailableWorkflowProposals(): Promise<{ id: string, title: string }[]> {
  // In a real implementation, this would scan the directory or fetch from an API
  // For now, we'll return a hardcoded list
  return [
    { id: 'ai-workflow', title: 'AI Workflow Proposal' }
  ];
}

// Function to get all available static pages
export async function getAvailableStaticPages(): Promise<{ id: string, title: string }[]> {
  // In a real implementation, this would scan the directory or fetch from an API
  // For now, we'll return a hardcoded list
  return [
    { id: 'about', title: 'About Sitruna' }
  ];
}
