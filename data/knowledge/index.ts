/**
 * Knowledge Data
 * 
 * This file contains structured data imported from the Airtable base 'KNOWLEGE_UPDATED'.
 * It can be imported and used in React components throughout the application.
 */

// Define types for the knowledge data
export interface KnowledgeItem {
  id: string;
  knowledgeId: string;
  title: string;
  details: string;
  contentCategories: string[];
  tools: string[];
  teams: string[];
  types: string[];
  dataStructure: string;
  implementationNotes: string;
  primaryUsers: string;
  aiIntegrationPriority: string;
  privacySensitivity: string;
}

// Define types for the content categories, tools, teams, and types
export type ContentCategory = 
  | 'AMAZON_KNOWLEDGE' 
  | 'CASE_MANAGEMENT' 
  | 'INTERNAL_OPERATIONS' 
  | 'CLIENT_INFORMATION' 
  | 'TEAM_COMMUNICATION';

export type Tool = 
  | 'CLICKUP' 
  | 'GOOGLE_SITES' 
  | 'GOOGLE_SHEETS' 
  | 'GOOGLE_DRIVE' 
  | 'FRONT' 
  | 'SLACK' 
  | 'BIG QUERY' 
  | 'CHATGPT' 
  | 'AMAZON_SC';

export type Team = 
  | 'Operations Team' 
  | 'Account Managers' 
  | 'Creative Team' 
  | 'All Staff' 
  | 'PPC Team';

export type KnowledgeType = 
  | 'Third-Party' 
  | 'First-Party' 
  | 'Client-Owned';

export type DataStructure = 
  | 'Structured' 
  | 'Semi-structured' 
  | 'Unstructured';

// Export the knowledge data
export const knowledgeData: KnowledgeItem[] = [
  {
    id: "recfxYx3l2gkcYa0I",
    knowledgeId: "1.1",
    title: "Marketplace Policies",
    details: "- VAT registration requirements\n- Country-specific tax rules\n- HFSS Exemption Application\n- Brand protection informations\n- Account configuration\n- User permissions",
    contentCategories: ["AMAZON_KNOWLEDGE"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party", "Third-Party"],
    dataStructure: "Structured",
    implementationNotes: "Critical for case compliance and decision-making; Includes VAT requirements",
    primaryUsers: "Amazon Knowledge > Marketplace Policies",
    aiIntegrationPriority: "Amazon policy changes → Documentation → Team implementation → Case handling",
    privacySensitivity: "High"
  },
  {
    id: "recKd5zSTQZ79RtoV",
    knowledgeId: "1.2",
    title: "Listing Management",
    details: "- Listing creation procedures\n- Buyer-seller messaging\n- Review management",
    contentCategories: ["AMAZON_KNOWLEDGE"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party", "Third-Party"],
    dataStructure: "Semi-structured",
    implementationNotes: "Core knowledge for product listings; Includes creation procedures",
    primaryUsers: "Amazon Knowledge > Listing Management",
    aiIntegrationPriority: "Team expertise → Documentation → Client implementation",
    privacySensitivity: "Medium"
  },
  {
    id: "recwjw9BZeGbXx4QJ",
    knowledgeId: "1.3",
    title: "Inventory & Fulfillment",
    details: "- Create FBA Shipment Plan\n- Shipping & Warehouse Partners\n- Inbound units management\n- FBM SKU management",
    contentCategories: ["AMAZON_KNOWLEDGE"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party", "Third-Party"],
    dataStructure: "Structured",
    implementationNotes: "Essential for inventory operations; Includes shipment plans",
    primaryUsers: "Amazon Knowledge > Inventory & Fulfillment",
    aiIntegrationPriority: "Team expertise → Documentation → Client implementation",
    privacySensitivity: "Medium"
  },
  {
    id: "recbvb2AGZ2JzcpQ2",
    knowledgeId: "1.4",
    title: "Promotions & Pricing",
    details: "- Pricing strategy\n- Promotional campaigns\n- Lightning deals",
    contentCategories: ["AMAZON_KNOWLEDGE"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party", "Third-Party"],
    dataStructure: "Semi-structured",
    implementationNotes: "Strategy and implementation knowledge; Includes pricing strategies",
    primaryUsers: "Amazon Knowledge > Promotions & Pricing",
    aiIntegrationPriority: "Team expertise → Documentation → Client implementation",
    privacySensitivity: "Medium"
  },
  {
    id: "recsoQixR9COL6lqH",
    knowledgeId: "1.5",
    title: "International Selling",
    details: "- Market entry requirements\n- Cross-border logistics\n- Translation services\n- Cross-border logistics",
    contentCategories: ["AMAZON_KNOWLEDGE"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party", "Third-Party"],
    dataStructure: "Structured",
    implementationNotes: "Cross-border selling requirements; Includes market requirements",
    primaryUsers: "Amazon Knowledge > International Selling",
    aiIntegrationPriority: "Regulatory requirements → Documentation → Client implementation",
    privacySensitivity: "Medium"
  },
  {
    id: "recRWPYkGaYvBnmAL",
    knowledgeId: "2.1",
    title: "Case Templates",
    details: "- Account suspension templates\n- Listing reinstatement processes\n- Response templates by case type",
    contentCategories: ["CASE_MANAGEMENT"],
    tools: ["CLICKUP", "CHATGPT", "AMAZON_SC"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Structured",
    implementationNotes: "High-value standardized formats; Includes suspension appeals",
    primaryUsers: "Case Management > Case Templates",
    aiIntegrationPriority: "Past cases → Templates → Appeal submission",
    privacySensitivity: "High"
  },
  {
    id: "recduiStDXgewqCzj",
    knowledgeId: "2.2",
    title: "Case Processes",
    details: "- Case tracking methodology\n- Escalation procedures",
    contentCategories: ["CASE_MANAGEMENT"],
    tools: ["CLICKUP"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Structured",
    implementationNotes: "Standard operating procedures for cases; Includes tracking methods",
    primaryUsers: "Case Management > Case Processes",
    aiIntegrationPriority: "Team expertise → Documentation → Case handling",
    privacySensitivity: "High"
  },
  {
    id: "recfXIurTOINU28LV",
    knowledgeId: "2.3",
    title: "Appeals & Compliance",
    details: "- ASIN restoration guidelines\n- Registration process",
    contentCategories: ["CASE_MANAGEMENT"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Structured",
    implementationNotes: "Critical for account health issues; Includes ASIN restoration",
    primaryUsers: "Case Management > Appeals & Compliance",
    aiIntegrationPriority: "Amazon policies → Documentation → Appeal submission",
    privacySensitivity: "High"
  },
  {
    id: "reczJ276UiC8FdoFm",
    knowledgeId: "3.1",
    title: "Company Structure",
    details: "- Org Chart\n- Company Policies\n- VAT Number + Companies House\n- Certificate of Engagement/Employment\n- Team directory",
    contentCategories: ["INTERNAL_OPERATIONS"],
    tools: ["CLICKUP"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Structured",
    implementationNotes: "Organizational framework; Includes org charts",
    primaryUsers: "Internal Operations > Company Structure",
    aiIntegrationPriority: "Management decisions → Documentation → Team reference",
    privacySensitivity: "Low"
  },
  {
    id: "recWPKQW3vu71XAWr",
    knowledgeId: "3.2",
    title: "Operational Procedures",
    details: "- Standard process templates\n- Documentation templates\n- Travel Booking\n- Cross-functional processes",
    contentCategories: ["INTERNAL_OPERATIONS"],
    tools: ["CLICKUP"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Semi-structured",
    implementationNotes: "Standard business processes; Includes standard processes",
    primaryUsers: "Internal Operations > Operational Procedures",
    aiIntegrationPriority: "Team expertise → Documentation → Team implementation",
    privacySensitivity: "Medium"
  },
  {
    id: "rechYTuZrMmP9QuC0",
    knowledgeId: "3.3",
    title: "Team Development",
    details: "- Training\n- New Starter Onboarding\n- Sitruna University training\n- Sitruna Best Practices Doc\n- Onboarding checklist",
    contentCategories: ["INTERNAL_OPERATIONS"],
    tools: ["CLICKUP", "GOOGLE_SITES"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Semi-structured",
    implementationNotes: "Staff training and growth; Includes training",
    primaryUsers: "Internal Operations > Team Development",
    aiIntegrationPriority: "Expert knowledge → Training materials → Team capabilities",
    privacySensitivity: "Medium"
  },
  {
    id: "recEYBg7O5G124FCS",
    knowledgeId: "3.4",
    title: "Technical Systems",
    details: "- Internal tools\n- Third-party applications\n- Access management",
    contentCategories: ["INTERNAL_OPERATIONS"],
    tools: ["CLICKUP"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Semi-structured",
    implementationNotes: "Technology infrastructure; Includes internal tools",
    primaryUsers: "Internal Operations > Technical Systems",
    aiIntegrationPriority: "Technical setup → Documentation → Team usage",
    privacySensitivity: "Low"
  },
  {
    id: "recAYD8qMkXeY6P8K",
    knowledgeId: "4.1",
    title: "Client Accounts",
    details: "- Active clients\n- Historical client information",
    contentCategories: ["CLIENT_INFORMATION"],
    tools: ["CLICKUP", "SLACK"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Semi-structured",
    implementationNotes: "Client-specific workspaces; Includes all active client accounts (Botivo",
    primaryUsers: "Client Information > Client Accounts",
    aiIntegrationPriority: "Client information → Task creation → Client servicing",
    privacySensitivity: "Medium"
  },
  {
    id: "recWiBTukRgo1fEIi",
    knowledgeId: "4.2",
    title: "Client Management",
    details: "- Client overview data\n- Team assignments\n- Service package details\n- Account setup procedures\n- Initial optimization tasks",
    contentCategories: ["CLIENT_INFORMATION"],
    tools: ["CLICKUP", "GOOGLE_SHEETS", "SLACK", "FRONT"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Structured",
    implementationNotes: "Client relationship data; Includes overview data",
    primaryUsers: "Client Information > Client Management",
    aiIntegrationPriority: "Client onboarding → Data entry → Team reference",
    privacySensitivity: "Medium"
  },
  {
    id: "recKBays7jPXILj1c",
    knowledgeId: "4.3",
    title: "Client Assets",
    details: "- Brand materials\n- Product images\n- Marketing collateral\n- Documentation and guides",
    contentCategories: ["CLIENT_INFORMATION"],
    tools: ["GOOGLE_DRIVE", "GOOGLE_SHEETS"],
    teams: ["All Staff"],
    types: ["Client-Owned", "First-Party"],
    dataStructure: "Unstructured",
    implementationNotes: "Visual and brand materials; Includes brand materials",
    primaryUsers: "Client Information > Client Assets",
    aiIntegrationPriority: "Client provision → Storage → Implementation",
    privacySensitivity: "Low"
  },
  {
    id: "rec9ygina0lwxSj2Z",
    knowledgeId: "4.4",
    title: "Client Performance",
    details: "- Client performance data",
    contentCategories: ["CLIENT_INFORMATION"],
    tools: ["CLICKUP", "BIG QUERY", "GOOGLE_SHEETS"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Structured",
    implementationNotes: "Success metrics and analytics; Includes metrics",
    primaryUsers: "Client Information > Client Performance",
    aiIntegrationPriority: "Data collection → Analysis → Client reporting",
    privacySensitivity: "Low"
  },
  {
    id: "recT1aZBWBpfTkeaI",
    knowledgeId: "5.1",
    title: "Client Communication",
    details: "- Client correspondence\n- Client-specific channels",
    contentCategories: ["TEAM_COMMUNICATION"],
    tools: ["FRONT", "SLACK"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Unstructured",
    implementationNotes: "External correspondence; Includes client correspondence",
    primaryUsers: "Client emails → Response → Resolution",
    aiIntegrationPriority: "Account Team",
    privacySensitivity: "Medium"
  },
  {
    id: "reciN8G6civ0sAYdL",
    knowledgeId: "5.2",
    title: "Internal Collaboration",
    details: "- Team communication\n- Internal discussions\n- Department-specific knowledge\n- Specialized projects\n- Short-term engagements",
    contentCategories: ["TEAM_COMMUNICATION"],
    tools: ["SLACK", "FRONT", "CLICKUP"],
    teams: ["All Staff"],
    types: ["First-Party"],
    dataStructure: "Unstructured",
    implementationNotes: "Team discussions; Includes team discussions",
    primaryUsers: "Team Communication > Internal Collaboration",
    aiIntegrationPriority: "Team questions → Discussion → Resolution",
    privacySensitivity: "Medium"
  },
  {
    id: "reccfLImclhnDkHJS",
    knowledgeId: "5.3",
    title: "Knowledge Sharing",
    details: "- Knowledge sharing\n- Amazon updates\n- Reference materials",
    contentCategories: ["TEAM_COMMUNICATION"],
    tools: ["SLACK", "CLICKUP", "FRONT"],
    teams: ["All Staff"],
    types: ["Third-Party", "First-Party"],
    dataStructure: "Unstructured",
    implementationNotes: "Information distribution; Includes updates",
    primaryUsers: "Team Communication > Knowledge Sharing",
    aiIntegrationPriority: "Discoveries → Communication → Team knowledge",
    privacySensitivity: "Medium"
  }
];

// Export helper functions to filter the data
export const filterByCategory = (category: ContentCategory): KnowledgeItem[] => {
  return knowledgeData.filter(item => 
    item.contentCategories.includes(category)
  );
};

export const filterByTool = (tool: Tool): KnowledgeItem[] => {
  return knowledgeData.filter(item => 
    item.tools.includes(tool)
  );
};

export const filterByTeam = (team: Team): KnowledgeItem[] => {
  return knowledgeData.filter(item => 
    item.teams.includes(team)
  );
};

export const filterByType = (type: KnowledgeType): KnowledgeItem[] => {
  return knowledgeData.filter(item => 
    item.types.includes(type)
  );
};

export const filterByDataStructure = (structure: DataStructure): KnowledgeItem[] => {
  return knowledgeData.filter(item => 
    item.dataStructure === structure
  );
};

// Export unique values for each category to use in filters
export const contentCategories: ContentCategory[] = [
  'AMAZON_KNOWLEDGE',
  'CASE_MANAGEMENT',
  'INTERNAL_OPERATIONS',
  'CLIENT_INFORMATION',
  'TEAM_COMMUNICATION'
];

export const tools: Tool[] = [
  'CLICKUP',
  'GOOGLE_SITES',
  'GOOGLE_SHEETS',
  'GOOGLE_DRIVE',
  'FRONT',
  'SLACK',
  'BIG QUERY',
  'CHATGPT',
  'AMAZON_SC'
];

export const teams: Team[] = [
  'Operations Team',
  'Account Managers',
  'Creative Team',
  'All Staff',
  'PPC Team'
];

export const knowledgeTypes: KnowledgeType[] = [
  'Third-Party',
  'First-Party',
  'Client-Owned'
];

export const dataStructures: DataStructure[] = [
  'Structured',
  'Semi-structured',
  'Unstructured'
];
