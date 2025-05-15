import React, { useState, useEffect } from 'react';
import { Database, FileText, Lock, Users, Search, BarChart2, ChevronDown, ChevronRight, HelpCircle, Info } from 'lucide-react';

const SitrunaKnowledgeMap = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  // Knowledge items with enhanced information from Airtable
  const knowledgeItems = [
    // AMAZON KNOWLEDGE
    { 
      id: "1.1", 
      name: "Marketplace Policies", 
      category: "AMAZON_KNOWLEDGE",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Structured",
      privacy: "High",
      flow: "Amazon policy changes → Documentation → Team implementation → Case handling",
      details: "VAT registration requirements, Country-specific tax rules, HFSS Exemption Application, Brand protection information, Account configuration, User permissions",
      teams: ["All Staff"],
      painPoints: ["Policy updates not automatically reflected in documentation", "Distributed across multiple systems", "High privacy sensitivity requires careful management"],
      maintenance: "Weekly"
    },
    { 
      id: "1.2", 
      name: "Listing Management", 
      category: "AMAZON_KNOWLEDGE",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Semi-structured",
      privacy: "Medium",
      flow: "Team expertise → Documentation → Client implementation",
      details: "Listing creation procedures, Buyer-seller messaging, Review management",
      teams: ["Operations Team", "Listing Team"],
      painPoints: ["Semi-structured format makes automation difficult", "Requires manual knowledge transfer"],
      maintenance: "Weekly"
    },
    { 
      id: "1.3", 
      name: "Inventory & Fulfillment", 
      category: "AMAZON_KNOWLEDGE",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Structured",
      privacy: "Medium",
      flow: "Team expertise → Documentation → Client implementation",
      details: "Create FBA Shipment Plan, Shipping & Warehouse Partners, Inbound units management, FBM SKU management",
      teams: ["Operations Team"],
      painPoints: ["Process changes require updates in multiple systems"],
      maintenance: "Monthly"
    },
    { 
      id: "1.4", 
      name: "Promotions & Pricing", 
      category: "AMAZON_KNOWLEDGE",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Semi-structured",
      privacy: "Medium",
      flow: "Team expertise → Documentation → Client implementation",
      details: "Pricing strategy, Promotional campaigns, Lightning deals",
      teams: ["Marketing Team", "Account Team"],
      painPoints: ["Strategy documentation scattered across systems"],
      maintenance: "Monthly"
    },
    { 
      id: "1.5", 
      name: "International Selling", 
      category: "AMAZON_KNOWLEDGE",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Structured",
      privacy: "Medium",
      flow: "Regulatory requirements → Documentation → Client implementation",
      details: "Market entry requirements, Cross-border logistics, Translation services",
      teams: ["Operations Team", "Account Team"],
      painPoints: ["Country-specific information can be hard to locate"],
      maintenance: "Quarterly"
    },
    
    // CASE MANAGEMENT
    { 
      id: "2.1", 
      name: "Case Templates", 
      category: "CASE_MANAGEMENT",
      tools: ["CLICKUP", "CHATGPT"],
      structure: "Structured",
      privacy: "High",
      flow: "Past cases → Templates → Appeal submission",
      details: "Account suspension templates, Listing reinstatement processes, Response templates by case type",
      teams: ["Operations Team", "Account Team"],
      painPoints: ["Templates not consistently updated based on success rates", "High privacy concerns"],
      maintenance: "Weekly",
      aiReady: true
    },
    { 
      id: "2.2", 
      name: "Case Processes", 
      category: "CASE_MANAGEMENT",
      tools: ["CLICKUP"],
      structure: "Structured",
      privacy: "High",
      flow: "Team expertise → Documentation → Case handling",
      details: "Case tracking methodology, Escalation procedures",
      teams: ["Operations Team", "Account Team"],
      painPoints: ["Process knowledge primarily in CLICKUP only", "High privacy sensitivity"],
      maintenance: "Monthly"
    },
    { 
      id: "2.3", 
      name: "Appeals & Compliance", 
      category: "CASE_MANAGEMENT",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Structured",
      privacy: "High",
      flow: "Amazon policies → Documentation → Appeal submission",
      details: "ASIN restoration guidelines, Registration process",
      teams: ["Operations Team", "Account Team"],
      painPoints: ["Critical for account health but high privacy concerns", "Requires frequent updates"],
      maintenance: "Weekly"
    },
    
    // INTERNAL OPERATIONS
    { 
      id: "3.1", 
      name: "Company Structure", 
      category: "INTERNAL_OPERATIONS",
      tools: ["CLICKUP"],
      structure: "Structured",
      privacy: "Low",
      flow: "Management decisions → Documentation → Team reference",
      details: "Org Chart, Company Policies, VAT Number + Companies House, Certificate of Engagement/Employment, Team directory",
      teams: ["All Staff"],
      painPoints: ["Limited to CLICKUP only", "Not easily accessible on mobile"],
      maintenance: "Monthly"
    },
    { 
      id: "3.2", 
      name: "Operational Procedures", 
      category: "INTERNAL_OPERATIONS",
      tools: ["CLICKUP"],
      structure: "Semi-structured",
      privacy: "Medium",
      flow: "Team expertise → Documentation → Team implementation",
      details: "Standard process templates, Documentation templates, Travel Booking, Cross-functional processes",
      teams: ["All Staff"],
      painPoints: ["Semi-structured format makes standardization difficult"],
      maintenance: "Monthly"
    },
    { 
      id: "3.3", 
      name: "Team Development", 
      category: "INTERNAL_OPERATIONS",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Semi-structured",
      privacy: "Medium",
      flow: "Expert knowledge → Training materials → Team capabilities",
      details: "Training, New Starter Onboarding, Sitruna University training, Sitruna Best Practices Doc, Onboarding checklist",
      teams: ["All Staff"],
      painPoints: ["Distributed across multiple systems", "Needs better tracking of completion"],
      maintenance: "Monthly"
    },
    { 
      id: "3.4", 
      name: "Technical Systems", 
      category: "INTERNAL_OPERATIONS",
      tools: ["CLICKUP"],
      structure: "Semi-structured",
      privacy: "Low",
      flow: "Technical setup → Documentation → Team usage",
      details: "Internal tools, Third-party applications, Access management",
      teams: ["IT Team", "All Staff"],
      painPoints: ["System documentation not consistently updated"],
      maintenance: "Quarterly"
    },
    
    // CLIENT INFORMATION
    { 
      id: "4.1", 
      name: "Client Accounts", 
      category: "CLIENT_INFORMATION",
      tools: ["CLICKUP", "SLACK"],
      structure: "Semi-structured",
      privacy: "Medium",
      flow: "Client information → Task creation → Client servicing",
      details: "Active clients, Historical client information",
      teams: ["Account Team", "Account Managers"],
      painPoints: ["Information scattered between CLICKUP and SLACK", "Inconsistent structure"],
      maintenance: "Weekly"
    },
    { 
      id: "4.2", 
      name: "Client Management", 
      category: "CLIENT_INFORMATION",
      tools: ["CLICKUP", "GOOGLE_SHEETS", "SLACK", "FRONT"],
      structure: "Structured",
      privacy: "Medium",
      flow: "Client onboarding → Data entry → Team reference",
      details: "Client overview data, Team assignments, Service package details, Account setup procedures, Initial optimization tasks",
      teams: ["Account Team", "Account Managers"],
      painPoints: ["Data spread across 4 different tools", "Maintenance intensive", "No single source of truth"],
      maintenance: "Daily"
    },
    { 
      id: "4.3", 
      name: "Client Assets", 
      category: "CLIENT_INFORMATION",
      tools: ["GOOGLE_DRIVE", "GOOGLE_SHEETS"],
      structure: "Unstructured",
      privacy: "Low",
      flow: "Client provision → Storage → Implementation",
      details: "Brand materials, Product images, Marketing collateral, Documentation and guides",
      teams: ["Creative Team", "Account Team"],
      painPoints: ["Unstructured format makes assets hard to locate", "Inconsistent organization"],
      maintenance: "Bi-weekly"
    },
    { 
      id: "4.4", 
      name: "Client Performance", 
      category: "CLIENT_INFORMATION",
      tools: ["CLICKUP", "BIG QUERY", "GOOGLE_SHEETS"],
      structure: "Structured",
      privacy: "Low",
      flow: "Data collection → Analysis → Client reporting",
      details: "Client performance data",
      teams: ["Account Team", "Account Managers"],
      painPoints: ["Data transformation required between systems", "No automated reporting"],
      maintenance: "Daily",
      aiReady: true
    },
    
    // TEAM COMMUNICATION
    { 
      id: "5.1", 
      name: "Client Communication", 
      category: "TEAM_COMMUNICATION",
      tools: ["FRONT", "SLACK"],
      structure: "Unstructured",
      privacy: "Medium",
      flow: "Client emails → Response → Resolution",
      details: "Client correspondence, Client-specific channels",
      teams: ["Account Team", "Account Managers"],
      painPoints: ["Unstructured format makes historical reference difficult", "Information not easily searchable"],
      maintenance: "Daily"
    },
    { 
      id: "5.2", 
      name: "Internal Collaboration", 
      category: "TEAM_COMMUNICATION",
      tools: ["SLACK", "FRONT", "CLICKUP"],
      structure: "Unstructured",
      privacy: "Medium",
      flow: "Team questions → Discussion → Resolution",
      details: "Team communication, Internal discussions, Department-specific knowledge, Specialized projects, Short-term engagements",
      teams: ["All Staff"],
      painPoints: ["Valuable knowledge buried in conversations", "No systematic way to extract insights"],
      maintenance: "Daily"
    },
    { 
      id: "5.3", 
      name: "Knowledge Sharing", 
      category: "TEAM_COMMUNICATION",
      tools: ["SLACK", "CLICKUP", "FRONT"],
      structure: "Unstructured",
      privacy: "Medium",
      flow: "Discoveries → Communication → Team knowledge",
      details: "Knowledge sharing, Amazon updates, Reference materials",
      teams: ["All Staff"],
      painPoints: ["No formal process to convert shared knowledge into documentation", "Information gets lost"],
      maintenance: "Weekly"
    }
  ];

  // Extract all tools
  const allTools = [...new Set(knowledgeItems.flatMap(item => item.tools))].sort();
  
  // Extract all teams
  const allTeams = [...new Set(knowledgeItems.flatMap(item => item.teams))].sort();
  
  // Group items by category
  const itemsByCategory = knowledgeItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  // Category configuration
  const categories = {
    "AMAZON_KNOWLEDGE": { 
      color: "bg-blue-100", 
      borderColor: "border-blue-500", 
      textColor: "text-blue-800",
      darkColor: "bg-blue-600", 
      icon: <Database className="w-5 h-5 text-blue-600" />,
      title: "Amazon Knowledge",
      description: "Amazon policies, listings, and marketplace operations"
    },
    "CASE_MANAGEMENT": { 
      color: "bg-purple-100", 
      borderColor: "border-purple-500", 
      textColor: "text-purple-800",
      darkColor: "bg-purple-600", 
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      title: "Case Management",
      description: "Tools and processes for managing Amazon cases"
    },
    "INTERNAL_OPERATIONS": { 
      color: "bg-teal-100", 
      borderColor: "border-teal-500", 
      textColor: "text-teal-800",
      darkColor: "bg-teal-600", 
      icon: <Users className="w-5 h-5 text-teal-600" />,
      title: "Internal Operations",
      description: "Company processes, structure, and procedures"
    },
    "CLIENT_INFORMATION": { 
      color: "bg-green-100", 
      borderColor: "border-green-500", 
      textColor: "text-green-800",
      darkColor: "bg-green-600", 
      icon: <Search className="w-5 h-5 text-green-600" />,
      title: "Client Information",
      description: "Client accounts, assets, and performance data"
    },
    "TEAM_COMMUNICATION": { 
      color: "bg-amber-100", 
      borderColor: "border-amber-500", 
      textColor: "text-amber-800",
      darkColor: "bg-amber-600", 
      icon: <BarChart2 className="w-5 h-5 text-amber-600" />,
      title: "Team Communication",
      description: "Internal and external communication channels"
    }
  };
  
  // Tool colors and icons
  const toolColors = {
    "CLICKUP": { color: "bg-blue-500", textColor: "text-white" },
    "GOOGLE_SITES": { color: "bg-green-500", textColor: "text-white" },
    "GOOGLE_SHEETS": { color: "bg-green-600", textColor: "text-white" },
    "GOOGLE_DRIVE": { color: "bg-yellow-600", textColor: "text-white" },
    "SLACK": { color: "bg-purple-500", textColor: "text-white" },
    "FRONT": { color: "bg-indigo-500", textColor: "text-white" },
    "BIG QUERY": { color: "bg-blue-600", textColor: "text-white" },
    "CHATGPT": { color: "bg-teal-500", textColor: "text-white" }
  };
  
  // Calculate statistics for overview
  const totalItems = knowledgeItems.length;
  const structuredItems = knowledgeItems.filter(item => item.structure === "Structured").length;
  const highPrivacyItems = knowledgeItems.filter(item => item.privacy === "High").length;
  const multiSystemItems = knowledgeItems.filter(item => item.tools.length > 1).length;
  const dailyMaintenanceItems = knowledgeItems.filter(item => item.maintenance === "Daily").length;
  
  // Helper function to get privacy icon
  const getPrivacyIcon = (level) => {
    switch(level) {
      case "High":
        return <Lock className="w-4 h-4 text-red-600" />;
      case "Medium":
        return <Lock className="w-4 h-4 text-amber-600" />;
      case "Low":
        return <Lock className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  // Helper function to get structure icon
  const getStructureIcon = (structure) => {
    switch(structure) {
      case "Structured":
        return <Database className="w-4 h-4 text-blue-600" />;
      case "Semi-structured":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "Unstructured":
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };
  
  // Filter items based on current filter
  const filteredItems = knowledgeItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'high-privacy') return item.privacy === 'High';
    if (filter === 'unstructured') return item.structure === 'Unstructured';
    if (filter === 'multi-system') return item.tools.length > 2;
    if (filter === 'ai-ready') return item.aiReady;
    if (filter.startsWith('tool-')) {
      const toolName = filter.replace('tool-', '');
      return item.tools.includes(toolName);
    }
    if (filter.startsWith('team-')) {
      const teamName = filter.replace('team-', '');
      return item.teams.includes(teamName);
    }
    if (filter.startsWith('category-')) {
      const categoryName = filter.replace('category-', '');
      return item.category === categoryName;
    }
    return true;
  });
  
  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    setExpandedItem(null); // Close any expanded items
  };
  
  // Toggle item expansion
  const toggleItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };
  
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-xl font-bold text-blue-600">{totalItems}</div>
          <div className="text-xs uppercase tracking-wider text-gray-500">Total Knowledge Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-xl font-bold text-purple-600">{structuredItems}</div>
          <div className="text-xs uppercase tracking-wider text-gray-500">Structured Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-xl font-bold text-red-600">{highPrivacyItems}</div>
          <div className="text-xs uppercase tracking-wider text-gray-500">High Privacy Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-xl font-bold text-amber-600">{multiSystemItems}</div>
          <div className="text-xs uppercase tracking-wider text-gray-500">Multi-System Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-xl font-bold text-green-600">{dailyMaintenanceItems}</div>
          <div className="text-xs uppercase tracking-wider text-gray-500">Daily Maintenance</div>
        </div>
      </div>
      
      {/* Category Overview */}
      <div className="space-y-4">
        {Object.entries(categories).map(([categoryName, category]) => (
          <div 
            key={categoryName}
            className={`${category.color} border-l-4 ${category.borderColor} rounded-md overflow-hidden shadow`}
          >
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleCategory(categoryName)}
            >
              <div className="flex items-center space-x-3">
                {category.icon}
                <div>
                  <h3 className="font-medium">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm bg-white px-2 py-1 rounded-full shadow-sm">
                  {itemsByCategory[categoryName].length} items
                </div>
                {expandedCategory === categoryName ? 
                  <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                }
              </div>
            </div>
            
            {expandedCategory === categoryName && (
              <div className="bg-white p-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {itemsByCategory[categoryName].map(item => (
                    <div 
                      key={item.id}
                      className="border rounded-md p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{item.id}</span>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          {item.aiReady && (
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                              <span className="w-1 h-1 bg-green-600 rounded-full mr-1"></span>
                              AI-Ready
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {getStructureIcon(item.structure)}
                          {getPrivacyIcon(item.privacy)}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tools.map(tool => (
                          <span 
                            key={tool} 
                            className={`${toolColors[tool].color} ${toolColors[tool].textColor} text-xs px-1.5 py-0.5 rounded`}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                      
                      {expandedItem === item.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teams</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.teams.map(team => (
                                  <span key={team} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                    {team}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Maintenance</div>
                              <div className="text-sm mt-1 capitalize">{item.maintenance}</div>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</div>
                            <div className="text-sm mt-1">{item.details}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pain Points</div>
                            <ul className="list-disc list-inside text-sm mt-1 text-red-700 space-y-1">
                              {item.painPoints.map((point, idx) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Opportunity Summary */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-3">Key Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-green-700 mb-2">Immediate Integration Points</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2">
                  <Info className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="font-medium">Case Templates (2.1)</span>
                  <span className="text-sm text-gray-600 block">Already using ChatGPT, high potential impact</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2">
                  <Info className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="font-medium">Client Performance (4.4)</span>
                  <span className="text-sm text-gray-600 block">Structured data with clear analysis workflows</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-blue-700 mb-2">System Consolidation Focus</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="rounded-full bg-blue-100 p-1 mr-2">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium">Client Management (4.2)</span>
                  <span className="text-sm text-gray-600 block">Data spread across 4 systems needs consolidation</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-blue-100 p-1 mr-2">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium">Knowledge Sharing (5.3)</span>
                  <span className="text-sm text-gray-600 block">Formalize process to capture shared knowledge</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSystemView = () => (
    <div className="space-y-6">
      {allTools.map(tool => {
        const toolItems = filteredItems.filter(item => item.tools.includes(tool));
        if (toolItems.length === 0) return null;
        
        return (
          <div key={tool} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${toolColors[tool].color}`}></div>
                <h2 className="font-medium">{tool.replace('_', ' ')}</h2>
                <span className="text-sm text-gray-500">({toolItems.length} items)</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {toolItems.map(item => (
                  <div 
                    key={item.id}
                    className={`border rounded-md p-3 ${categories[item.category].color}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <span className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs mr-1">{item.id}</span>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        {getStructureIcon(item.structure)}
                        {getPrivacyIcon(item.privacy)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{categories[item.category].title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  const renderTeamView = () => (
    <div className="space-y-6">
      {allTeams.map(team => {
        const teamItems = filteredItems.filter(item => item.teams.includes(team));
        if (teamItems.length === 0) return null;
        
        return (
          <div key={team} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h2 className="font-medium">{team}</h2>
                <span className="text-sm text-gray-500">({teamItems.length} items)</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamItems.map(item => (
                  <div 
                    key={item.id}
                    className={`border rounded-md p-3 ${categories[item.category].color}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <span className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs mr-1">{item.id}</span>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        {getStructureIcon(item.structure)}
                        {getPrivacyIcon(item.privacy)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tools.map(tool => (
                        <span 
                          key={tool}
                          className={`${toolColors[tool].color} ${toolColors[tool].textColor} text-xs px-1.5 py-0.5 rounded`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  const renderPainPointsView = () => {
    // Group items by pain point type
    const painPointGroups = {
      "High Privacy Items": filteredItems.filter(item => item.privacy === "High"),
      "Multi-System Items": filteredItems.filter(item => item.tools.length > 1),
      "Unstructured Data": filteredItems.filter(item => item.structure === "Unstructured"),
      "High Maintenance": filteredItems.filter(item => ["Daily", "Weekly"].includes(item.maintenance)),
    };
    
    return (
      <div className="space-y-6">
        {Object.entries(painPointGroups).map(([groupName, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={groupName} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-100 p-1 rounded-full">
                    <Info className="w-4 h-4 text-red-600" />
                  </div>
                  <h2 className="font-medium">{groupName}</h2>
                  <span className="text-sm text-gray-500">({items.length} items)</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(item => (
                    <div 
                      key={item.id}
                      className={`border rounded-md p-3 ${categories[item.category].color}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <span className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs mr-1">{item.id}</span>
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          {getStructureIcon(item.structure)}
                          {getPrivacyIcon(item.privacy)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-red-700 space-y-1">
                        {item.painPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start">
                            <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="p-4 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-2">SITRUNA KNOWLEDGE ECOSYSTEM</h1>
      <p className="text-gray-600 text-center mb-6">Interactive visualization of knowledge assets, locations, and ownership</p>
      
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex space-x-2 items-center">
          <div className="text-sm font-medium text-gray-700">VIEW:</div>
          <select 
            className="border rounded-md px-2 py-1 text-sm bg-white shadow-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="systems">Systems View</option>
            <option value="teams">Teams View</option>
            <option value="painpoints">Pain Points</option>
          </select>
        </div>
        
        <div className="flex space-x-2 items-center">
          <div className="text-sm font-medium text-gray-700">FILTER:</div>
          <select 
            className="border rounded-md px-2 py-1 text-sm bg-white shadow-sm flex-grow md:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <optgroup label="──── CATEGORIES ────">
              {Object.keys(categories).map(cat => (
                <option key={cat} value={`category-${cat}`}>{categories[cat].title}</option>
              ))}
            </optgroup>
            <optgroup label="──── SPECIAL FILTERS ────">
              <option value="high-privacy">High Privacy Items</option>
              <option value="unstructured">Unstructured Data</option>
              <option value="multi-system">Multi-System Items</option>
              <option value="ai-ready">AI-Ready Items</option>
            </optgroup>
          </select>
        </div>
        
        <button 
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setShowLegend(!showLegend)}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showLegend ? 'Hide Legend' : 'Show Legend'}</span>
        </button>
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Structure Types</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Structured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Semi-structured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Unstructured</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Privacy Levels</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span className="text-sm">High Privacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">Medium Privacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Low Privacy</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Systems</h3>
              <div className="space-y-2">
                {Object.entries(toolColors).slice(0, 4).map(([tool, colors]) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colors.color}`}></div>
                    <span className="text-sm">{tool.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Categories</h3>
              <div className="space-y-2">
                {Object.entries(categories).slice(0, 4).map(([name, category]) => (
                  <div key={name} className="flex items-center space-x-2">
                    {category.icon}
                    <span className="text-sm">{category.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'systems' && renderSystemView()}
        {activeTab === 'teams' && renderTeamView()}
        {activeTab === 'painpoints' && renderPainPointsView()}
      </div>
    </div>
  );
};

export default SitrunaKnowledgeMap;