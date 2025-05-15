import React, { useState, useEffect } from 'react';
import { Database, FileText, Lock, Users, Search, BarChart2, ChevronDown, ChevronRight, HelpCircle, Info } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  name: string;
  category: string;
  tools: string[];
  structure: string;
  privacy: string;
  flow: string;
  teams?: string[];
  painPoints?: string[];
  [key: string]: any;
}

interface CategoryInfo {
  color: string;
  borderColor: string;
  textColor: string;
  darkColor: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

interface ToolColors {
  [key: string]: {
    color: string;
    textColor: string;
  };
}

const SitrunaKnowledgeMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Simplified knowledge items
  const knowledgeItems: KnowledgeItem[] = [
    { 
      id: "1.1", 
      name: "Marketplace Policies", 
      category: "AMAZON_KNOWLEDGE",
      tools: ["CLICKUP", "GOOGLE_SITES"],
      structure: "Structured",
      privacy: "High",
      flow: "Amazon policy changes → Documentation → Team implementation → Case handling"
    },
    { 
      id: "2.1", 
      name: "Client Files", 
      category: "CASE_MANAGEMENT",
      tools: ["GOOGLE_DRIVE", "CLICKUP"],
      structure: "Semi-structured",
      privacy: "Medium",
      flow: "Client onboarding → Document collection → File organization → Access management"
    },
    { 
      id: "3.1", 
      name: "Training Materials", 
      category: "TEAM_COMMUNICATION",
      tools: ["GOOGLE_SITES", "SLACK"],
      structure: "Structured",
      privacy: "Low",
      flow: "Training needs → Material development → Publication → Feedback loop"
    }
  ];

  // Categories with color coding and metadata
  const categories: Record<string, CategoryInfo> = {
    'AMAZON_KNOWLEDGE': {
      color: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      darkColor: 'bg-blue-700',
      icon: <Database className="w-5 h-5 text-blue-500" />,
      title: 'Amazon Knowledge',
      description: 'Information about Amazon marketplace policies, account management, and operational guidelines.'
    },
    'CASE_MANAGEMENT': {
      color: 'bg-green-50', 
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      darkColor: 'bg-green-700',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      title: 'Case Management',
      description: 'Client case information, documents, and management processes.'
    },
    'TEAM_COMMUNICATION': {
      color: 'bg-purple-50', 
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      darkColor: 'bg-purple-700',
      icon: <Users className="w-5 h-5 text-purple-500" />,
      title: 'Team Communication',
      description: 'Internal team communication, training materials, and knowledge sharing.'
    }
  };
  
  // Tool colors for visual representation
  const toolColors: ToolColors = {
    'CLICKUP': { color: 'bg-purple-100', textColor: 'text-purple-800' },
    'GOOGLE_SITES': { color: 'bg-blue-100', textColor: 'text-blue-800' },
    'GOOGLE_SHEETS': { color: 'bg-green-100', textColor: 'text-green-800' },
    'GOOGLE_DRIVE': { color: 'bg-yellow-100', textColor: 'text-yellow-800' },
    'SLACK': { color: 'bg-indigo-100', textColor: 'text-indigo-800' },
    'FRONT': { color: 'bg-red-100', textColor: 'text-red-800' },
    'BIG QUERY': { color: 'bg-blue-100', textColor: 'text-blue-800' },
    'CHATGPT': { color: 'bg-green-100', textColor: 'text-green-800' }
  };

  // Group items by category
  const itemsByCategory = knowledgeItems.reduce((acc: Record<string, KnowledgeItem[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  // Icons for privacy levels
  const getPrivacyIcon = (level: string) => {
    switch(level) {
      case 'High': return <Lock className="w-4 h-4 text-red-500" />;
      case 'Medium': return <Lock className="w-4 h-4 text-yellow-500" />;
      case 'Low': return <Lock className="w-4 h-4 text-green-500" />;
      default: return <Lock className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Icons for structure types
  const getStructureIcon = (structure: string) => {
    switch(structure) {
      case 'Structured': return <Database className="w-4 h-4 text-blue-500" />;
      case 'Semi-structured': return <Database className="w-4 h-4 text-purple-500" />;
      case 'Unstructured': return <Database className="w-4 h-4 text-gray-500" />;
      default: return <Database className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Toggle expansion of categories
  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    setExpandedItem(null);
  };
  
  // Toggle expansion of individual items
  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 mb-6">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <Database className="w-6 h-6 mr-2 text-indigo-600" />
            Sitruna Knowledge Map
          </h1>
          <p className="text-gray-600 mt-1">
            Interactive visualization of knowledge systems, workflows, and resources
          </p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar with navigation tabs */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="space-y-1">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'details' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Detailed View
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-800 mb-3">Filters</h3>
              
              <div className="space-y-2">
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {Object.keys(categories).map(cat => (
                    <option key={cat} value={`category-${cat}`}>{categories[cat].title}</option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4">
                <button 
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  onClick={() => setShowLegend(!showLegend)}
                >
                  <Info className="w-4 h-4 mr-1" />
                  {showLegend ? 'Hide Legend' : 'Show Legend'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {/* Legend */}
            {showLegend && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Legend</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Knowledge Categories</h4>
                    <div className="space-y-2">
                      {Object.entries(categories).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${value.darkColor}`}></div>
                          <span className="text-sm ml-2">{value.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tools</h4>
                    <div className="space-y-2">
                      {Object.entries(toolColors).map(([tool, colors]) => (
                        <div key={tool} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors.color}`}></div>
                          <span className="text-sm ml-2">{tool.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content for Overview tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Knowledge Overview Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Knowledge Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(itemsByCategory).map(([categoryName, items]) => (
                      <div 
                        key={categoryName}
                        className={`border rounded-md p-3 ${categories[categoryName].color}`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            {categories[categoryName].icon}
                            <h3 className="font-medium ml-2">{categories[categoryName].title}</h3>
                          </div>
                          <span className="text-xs bg-white bg-opacity-60 rounded-full px-2 py-0.5">{items.length}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">{categories[categoryName].title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              
                {/* Categories and Items */}
                <div className="space-y-4">
                  {Object.entries(itemsByCategory).map(([categoryName, items]) => (
                    <div key={categoryName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div 
                        className={`border-l-4 ${categories[categoryName].borderColor} p-4 flex justify-between items-center cursor-pointer`}
                        onClick={() => toggleCategory(categoryName)}
                      >
                        <div className="flex items-center">
                          {categories[categoryName].icon}
                          <h3 className="font-medium ml-2">{categories[categoryName].title}</h3>
                          <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 ml-2">{items.length} items</span>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700">
                          {expandedCategory === categoryName ? 
                            <ChevronDown className="w-5 h-5" /> : 
                            <ChevronRight className="w-5 h-5" />
                          }
                        </button>
                      </div>
                      
                      {expandedCategory === categoryName && (
                        <div className="px-4 pb-4 pt-2">
                          <div className="border-t pt-2 space-y-3">
                            {items.map(item => (
                              <div 
                                key={item.id}
                                className={`border rounded-md p-3 ${categories[item.category].color}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <div className="flex items-center mt-1 space-x-2">
                                      <div className="flex items-center text-sm text-gray-600">
                                        {getPrivacyIcon(item.privacy)}
                                        <span className="text-xs ml-1">{item.privacy}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        {getStructureIcon(item.structure)}
                                        <span className="text-xs ml-1">{item.structure}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {item.tools.map((tool: string) => (
                                        <span 
                                          key={`${item.id}-${tool}`}
                                          className={`${toolColors[tool].color} ${toolColors[tool].textColor} text-xs px-1.5 py-0.5 rounded`}
                                        >
                                          {tool.replace('_', ' ')}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <button 
                                    className="text-gray-500 hover:text-gray-700 mt-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(item.id);
                                    }}
                                  >
                                    {expandedItem === item.id ? 
                                      <ChevronDown className="w-5 h-5" /> : 
                                      <ChevronRight className="w-5 h-5" />
                                    }
                                  </button>
                                </div>
                                
                                {expandedItem === item.id && (
                                  <div className="mt-3 pt-3 border-t text-sm">
                                    <div className="text-gray-700">
                                      <strong>Flow:</strong> {item.flow}
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
              </div>
            )}
            
            {/* Content for Details tab */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Knowledge Map</h2>
                <p className="text-gray-600 mb-6">
                  This view provides a comprehensive breakdown of each knowledge component with detailed metadata.
                </p>
                
                <div className="space-y-6">
                  {knowledgeItems.map(item => (
                    <div
                      key={item.id}
                      className={`border rounded-md p-3 ${categories[item.category].color}`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center">
                            {categories[item.category].icon}
                            <h3 className="font-medium ml-2">{item.name}</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                            <div>
                              <p className="text-gray-700">
                                <strong>Category:</strong> {categories[item.category].title}
                              </p>
                              <p className="text-gray-700">
                                <strong>Privacy Level:</strong> {item.privacy}
                              </p>
                              <p className="text-gray-700">
                                <strong>Structure:</strong> {item.structure}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <strong>Tools:</strong>
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.tools.map((tool: string) => (
                                  <span 
                                    key={`${item.id}-${tool}`}
                                    className={`${toolColors[tool].color} ${toolColors[tool].textColor} text-xs px-1.5 py-0.5 rounded`}
                                  >
                                    {tool.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-sm">
                            <p className="text-gray-700">
                              <strong>Knowledge Flow:</strong>
                            </p>
                            <p className="mt-1">{item.flow}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Content for Analytics tab */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Knowledge Analytics</h2>
                <p className="text-gray-600 mb-6">
                  Analysis of knowledge distribution, usage patterns, and optimization opportunities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium text-blue-800 mb-2">Total Knowledge Areas</h3>
                    <p className="text-2xl font-bold text-blue-600">{knowledgeItems.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="font-medium text-green-800 mb-2">Categories</h3>
                    <p className="text-2xl font-bold text-green-600">{Object.keys(itemsByCategory).length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-md">
                    <h3 className="font-medium text-purple-800 mb-2">Tools Used</h3>
                    <p className="text-2xl font-bold text-purple-600">{Object.keys(toolColors).length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SitrunaKnowledgeMap;
