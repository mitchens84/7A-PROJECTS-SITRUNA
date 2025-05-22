/**
 * Content loader utility that loads content from the /content directory
 */

// Helper function to fetch JSON content
async function fetchJsonContent(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading content:', error);
    throw error;
  }
}

// Function to fetch HTML content
async function fetchHtmlContent(path) {
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
export async function loadKnowledgeMapData() {
  return await fetchJsonContent('/7A-PROJECTS-SITRUNA/content/knowledge-map/nodes-data.json');
}

export async function loadWorkflowProposal(id) {
  return await fetchJsonContent(`/7A-PROJECTS-SITRUNA/content/workflow-proposals/${id}.json`);
}

export async function loadStaticPage(id) {
  return await fetchHtmlContent(`/7A-PROJECTS-SITRUNA/content/static-pages/${id}.html`);
}

// Function to get all available workflow proposals
export async function getAvailableWorkflowProposals() {
  // In a real implementation, this would scan the directory or fetch from an API
  // For now, we'll return a hardcoded list
  return [
    { id: 'ai-workflow', title: 'AI Workflow Proposal' }
  ];
}

// Function to get all available static pages
export async function getAvailableStaticPages() {
  // In a real implementation, this would scan the directory or fetch from an API
  // For now, we'll return a hardcoded list
  return [
    { id: 'overview', title: 'Overview' },
    { id: 'getting-started', title: 'Getting Started' }
  ];
}

// Function to load data visualization data
export async function loadDataVisualizationData() {
  return await fetchJsonContent('/content/data-visualization/chart-data.json');
}
