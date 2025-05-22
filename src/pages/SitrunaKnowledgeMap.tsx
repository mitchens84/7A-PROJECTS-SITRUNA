import React, { useState, useEffect, useRef } from 'react';
import '../assets/knowledge-map.css';
import { loadKnowledgeMapData } from '../utils/content/contentLoader';
import type { KnowledgeMapNode, KnowledgeMapConnection } from '../utils/content/contentLoader';
import Breadcrumbs from '../components/Breadcrumbs';

// Define TypeScript interfaces for our data
interface NodeDetails {
  purpose: string;
  components: string[];
  implementation: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'core' | 'module' | 'service' | 'external';
  description: string;
  details: NodeDetails;
}

interface Connection {
  source: string;
  target: string;
  strength: 'strong' | 'medium' | 'weak';
}

type NodeType = 'core' | 'module' | 'service' | 'external';

// Global search interfaces
interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
}

const SitrunaKnowledgeMap: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [nodesData, setNodesData] = useState<Node[]>([]);
  const [connectionsData, setConnectionsData] = useState<Connection[]>([]);
  const [sidebarContent, setSidebarContent] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [typeFilter, setTypeFilter] = useState<NodeType[]>([]);
  
  // Global search state
  const [globalSearchActive, setGlobalSearchActive] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<SearchResult[]>([]);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const globalSearchInputRef = useRef<HTMLInputElement>(null);
  const zoomLevel = useRef(1);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // Node types for filtering
  const nodeTypes = [
    { value: 'core' as NodeType, label: 'Core Systems' },
    { value: 'module' as NodeType, label: 'Modules' },
    { value: 'service' as NodeType, label: 'Services' },
    { value: 'external' as NodeType, label: 'External Systems' }
  ];

  // Toggle node type in filter
  const toggleTypeFilter = (type: 'core' | 'module' | 'service' | 'external') => {
    setTypeFilter(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Clear all type filters
  const clearTypeFilters = () => {
    setTypeFilter([]);
  };

  // Function to export the map data
  const exportMapData = () => {
    const data = {
      nodes: nodesData,
      connections: connectionsData,
      activeNode: activeNodeId
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitruna-knowledge-map.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    const delta = 1.1;
    zoomLevel.current *= delta;
    zoomLevel.current = Math.min(2, zoomLevel.current);
    applyZoom(delta);
  };

  const handleZoomOut = () => {
    const delta = 0.9;
    zoomLevel.current *= delta;
    zoomLevel.current = Math.max(0.5, zoomLevel.current);
    applyZoom(delta);
  };

  const handleZoomReset = () => {
    const delta = 1 / zoomLevel.current;
    zoomLevel.current = 1;
    applyZoom(delta);
  };

  const applyZoom = (delta: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    
    const centerX = svg.clientWidth / 2;
    const centerY = svg.clientHeight / 2;

    setNodesData(prev => prev.map(node => {
      const dx = node.x - centerX;
      const dy = node.y - centerY;
      return {
        ...node,
        x: centerX + dx * delta,
        y: centerY + dy * delta
      };
    }));
  };

  useEffect(() => {
    // Load knowledge map data from content directory
    const loadData = async () => {
      try {
        const mapData = await loadKnowledgeMapData();
        setNodesData(mapData.nodes);
        setFilteredNodes(mapData.nodes);
        setConnectionsData(mapData.connections);
      } catch (error) {
        console.error('Error loading knowledge map data:', error);
        // Fallback to default data if loading fails
        // This static data should ideally match the structure in the content file
        const nodes: Node[] = [
          {
            id: 'sitruna-core',
            x: 400,
            y: 300,
            label: 'Sitruna Core',
            type: 'core',
            description: 'Central knowledge management system for Sitruna',
            details: {
              purpose: 'Organize and connect all Sitruna knowledge',
              components: ['Knowledge graph', 'Document repository', 'User profiles', 'Integration APIs'],
              implementation: 'NodeJS + React + Neo4j Graph Database'
            }
          },
          {
            id: 'artifact-management',
            x: 650,
            y: 200,
            label: 'Artifact Management',
            type: 'module',
            description: 'System for organizing digital artifacts',
            details: {
              purpose: 'Maintain and version digital assets',
              components: ['File storage', 'Version control', 'Metadata tagging', 'Search capabilities'],
              implementation: 'MinIO + PostgreSQL + ElasticSearch'
            }
          },
          {
            id: 'user-profiles',
            x: 650,
            y: 400,
            label: 'User Profiles',
            type: 'module',
            description: 'User management and authentication',
            details: {
              purpose: 'User identity and access control',
              components: ['Authentication', 'Authorization', 'Profile management', 'Activity tracking'],
              implementation: 'OAuth2 + JWT + Redis'
            }
          },
          {
            id: 'workflow-engine',
            x: 200,
            y: 150,
            label: 'Workflow Engine',
            type: 'module',
            description: 'Process automation system',
            details: {
              purpose: 'Automate business processes and workflows',
              components: ['Task orchestration', 'State management', 'Notifications', 'SLA monitoring'],
              implementation: 'Temporal + gRPC'
            }
          },
          {
            id: 'analytics',
            x: 200,
            y: 450,
            label: 'Analytics Platform',
            type: 'module',
            description: 'Data analysis and visualization',
            details: {
              purpose: 'Provide insights from system data',
              components: ['Data pipeline', 'Metrics collection', 'Dashboards', 'Reports'],
              implementation: 'Apache Kafka + ClickHouse + Grafana'
            }
          },
          {
            id: 'integration-hub',
            x: 400,
            y: 550,
            label: 'Integration Hub',
            type: 'module',
            description: 'External system integrations',
            details: {
              purpose: 'Connect with third-party systems',
              components: ['API gateway', 'Connector framework', 'Data transformation', 'Webhook management'],
              implementation: 'Kong + NestJS + Apache Camel'
            }
          }
        ];

        const connections: Connection[] = [
          { source: 'sitruna-core', target: 'artifact-management', strength: 'strong' },
          { source: 'sitruna-core', target: 'user-profiles', strength: 'strong' },
          { source: 'sitruna-core', target: 'workflow-engine', strength: 'medium' },
          { source: 'sitruna-core', target: 'analytics', strength: 'medium' },
          { source: 'sitruna-core', target: 'integration-hub', strength: 'strong' },
          { source: 'artifact-management', target: 'user-profiles', strength: 'medium' },
          { source: 'workflow-engine', target: 'analytics', strength: 'weak' },
          { source: 'workflow-engine', target: 'integration-hub', strength: 'medium' },
          { source: 'analytics', target: 'integration-hub', strength: 'medium' },
        ];

        setNodesData(nodes);
        setFilteredNodes(nodes);
        setConnectionsData(connections);
      }
    };
    
    loadData();

    // Setup zoom and pan behaviors
    const svg = svgRef.current;
    if (svg) {
      const handleMouseDown = (e: MouseEvent) => {
        if (e.target === svg) {
          isDragging.current = true;
          dragOffset.current = {
            x: e.clientX,
            y: e.clientY
          };
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
          const dx = e.clientX - dragOffset.current.x;
          const dy = e.clientY - dragOffset.current.y;
          dragOffset.current = {
            x: e.clientX,
            y: e.clientY
          };

          // Move all nodes
          setNodesData(prev => prev.map(node => ({
            ...node,
            x: node.x + dx,
            y: node.y + dy
          })));
        }
      };

      const handleMouseUp = () => {
        isDragging.current = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoomLevel.current *= delta;

        // Limit zoom levels
        zoomLevel.current = Math.max(0.5, Math.min(2, zoomLevel.current));

        const centerX = svg.clientWidth / 2;
        const centerY = svg.clientHeight / 2;

        // Move nodes relative to center point based on zoom
        setNodesData(prev => prev.map(node => {
          const dx = node.x - centerX;
          const dy = node.y - centerY;
          return {
            ...node,
            x: centerX + dx * delta,
            y: centerY + dy * delta
          };
        }));
      };

      svg.addEventListener('mousedown', handleMouseDown);
      svg.addEventListener('mousemove', handleMouseMove);
      svg.addEventListener('mouseup', handleMouseUp);
      svg.addEventListener('mouseleave', handleMouseUp);
      svg.addEventListener('wheel', handleWheel);

      return () => {
        svg.removeEventListener('mousedown', handleMouseDown);
        svg.removeEventListener('mousemove', handleMouseMove);
        svg.removeEventListener('mouseup', handleMouseUp);
        svg.removeEventListener('mouseleave', handleMouseUp);
        svg.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  // Filter nodes based on search term and selected filter
  useEffect(() => {
    let result = nodesData;
    
    // Apply type filter
    if (typeFilter.length > 0) {
      result = result.filter(node => typeFilter.includes(node.type));
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(node => 
        node.label.toLowerCase().includes(term) || 
        node.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredNodes(result);
  }, [searchTerm, typeFilter, nodesData]);

  // Global search effect
  useEffect(() => {
    if (globalSearchQuery) {
      const results: SearchResult[] = [];
      
      // Search in nodes
      nodesData.forEach(node => {
        if (node.label.toLowerCase().includes(globalSearchQuery.toLowerCase())) {
          results.push({
            id: node.id,
            title: node.label,
            description: node.description,
            path: `nodes/${node.id}`
          });
        }
      });
      
      // Search in connections
      connectionsData.forEach(connection => {
        if (connection.source.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
            connection.target.toLowerCase().includes(globalSearchQuery.toLowerCase())) {
          const sourceNode = nodesData.find(n => n.id === connection.source);
          const targetNode = nodesData.find(n => n.id === connection.target);
          
          if (sourceNode && targetNode) {
            results.push({
              id: `${sourceNode.id}-${targetNode.id}`,
              title: `${sourceNode.label} ↔ ${targetNode.label}`,
              description: `Connection between ${sourceNode.label} and ${targetNode.label}`,
              path: `connections/${sourceNode.id}-${targetNode.id}`
            });
          }
        }
      });
      
      setGlobalSearchResults(results);
    } else {
      setGlobalSearchResults([]);
    }
  }, [globalSearchQuery, nodesData, connectionsData]);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    const node = nodesData.find(n => n.id === nodeId) || null;
    if (node) {
      setActiveNodeId(nodeId);
      setSidebarContent(node);
      setShowSidebar(true);
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setActiveNodeId(null);
  };

  const getConnectionClassName = (strength: 'strong' | 'medium' | 'weak') => {
    switch (strength) {
      case 'strong': return 'connection-strong';
      case 'medium': return 'connection-medium';
      case 'weak': return 'connection-weak';
      default: return 'connection-medium';
    }
  };

  // Handle global search input change
  const handleGlobalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchQuery(e.target.value);
  };

  // Global search functions
  const handleGlobalSearchToggle = (e: KeyboardEvent) => {
    // Toggle global search with Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setGlobalSearchActive(prev => !prev);
      
      // Focus the search input when activated
      if (!globalSearchActive && globalSearchInputRef.current) {
        setTimeout(() => {
          globalSearchInputRef.current?.focus();
        }, 10);
      }
    }
    
    // Close with Escape key
    if (e.key === 'Escape' && globalSearchActive) {
      setGlobalSearchActive(false);
      setGlobalSearchQuery('');
    }
  };
  
  const performGlobalSearch = () => {
    if (!globalSearchQuery.trim()) {
      setGlobalSearchResults([]);
      return;
    }
    
    // Search in nodes data
    const nodeResults = nodesData
      .filter(node => {
        const searchableText = `${node.label} ${node.description} ${node.details.purpose} ${node.details.implementation}`.toLowerCase();
        return searchableText.includes(globalSearchQuery.toLowerCase());
      })
      .map(node => ({
        id: node.id,
        title: node.label,
        description: node.description,
        path: `/knowledge-map/${node.id}`
      }));
      
    setGlobalSearchResults(nodeResults);
  };
  
  const handleGlobalSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearchResults.length > 0) {
      // Navigate to the first result
      const firstResult = globalSearchResults[0];
      handleNodeClick(firstResult.id);
      setGlobalSearchActive(false);
      setGlobalSearchQuery('');
    }
  };
  
  const handleGlobalSearchResultClick = (result: SearchResult) => {
    handleNodeClick(result.id);
    setGlobalSearchActive(false);
    setGlobalSearchQuery('');
  };
  
  // Set up global keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleGlobalSearchToggle);
    return () => {
      window.removeEventListener('keydown', handleGlobalSearchToggle);
    };
  }, [globalSearchActive]);
  
  // Perform search when query changes
  useEffect(() => {
    performGlobalSearch();
  }, [globalSearchQuery]);

  return (
    <div className="knowledge-map">
      <Breadcrumbs />
      <h1 className="main-title">Sitruna Knowledge Map</h1>
      <p className="description">
        Interactive visualization of Sitruna's knowledge architecture and system components.
        Click on nodes to explore details and connections between different parts of the system.
      </p>
      
      <div className="map-controls-panel">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>
          
          <div className="filter-container">
            <span>Filter by type:</span>
            <div className="checkbox-group">
              {nodeTypes.map(type => (
                <label key={type.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={typeFilter.includes(type.value)}
                    onChange={() => toggleTypeFilter(type.value)}
                    className="checkbox-input"
                  />
                  {type.label}
                </label>
              ))}
            </div>
            <button className="clear-filters" onClick={clearTypeFilters}>
              Clear Filters
            </button>
          </div>
          
          <button className="export-button" onClick={exportMapData}>
            Export Map
          </button>
        </div>
        
        <div className="zoom-controls">
          <button onClick={handleZoomIn} className="zoom-button">+</button>
          <button onClick={handleZoomReset} className="zoom-button">Reset</button>
          <button onClick={handleZoomOut} className="zoom-button">−</button>
        </div>
      </div>
      
      <div className="map-container">
        <svg ref={svgRef} className="knowledge-graph" width="100%" height="600">
          {/* Render connections - only for filtered nodes */}
          {connectionsData
            .filter(connection => 
              filteredNodes.some(n => n.id === connection.source) && 
              filteredNodes.some(n => n.id === connection.target)
            )
            .map((connection, index) => {
              const source = nodesData.find(n => n.id === connection.source);
              const target = nodesData.find(n => n.id === connection.target);
              if (!source || !target) return null;
              
              return (
                <line
                  key={`connection-${index}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={`connection ${getConnectionClassName(connection.strength)}`}
                />
              );
            })}
          
          {/* Render filtered nodes */}
          {filteredNodes.map(node => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => handleNodeClick(node.id)}
              className={`node ${node.type} ${activeNodeId === node.id ? 'active' : ''}`}
            >
              <circle r={node.type === 'core' ? 50 : 40} />
              <text dy=".3em" textAnchor="middle">{node.label}</text>
            </g>
          ))}
        </svg>
        
        {/* Status indicator for search/filter results */}
        {filteredNodes.length === 0 && (
          <div className="no-results-indicator">
            No nodes match your search or filter criteria
          </div>
        )}
        
        {showSidebar && sidebarContent && (
          <div className="sidebar">
            <button className="close-button" onClick={closeSidebar}>&times;</button>
            <h2>{sidebarContent.label}</h2>
            <p className="node-description">{sidebarContent.description}</p>
            
            <div className="details-section">
              <h3>Purpose</h3>
              <p>{sidebarContent.details.purpose}</p>
              
              <h3>Components</h3>
              <ul>
                {sidebarContent.details.components.map((component, idx) => (
                  <li key={idx}>{component}</li>
                ))}
              </ul>
              
              <h3>Implementation</h3>
              <p className="implementation-info">{sidebarContent.details.implementation}</p>
            </div>
            
            <h3>Connections</h3>
            <ul className="connections-list">
              {connectionsData
                .filter(conn => conn.source === sidebarContent.id || conn.target === sidebarContent.id)
                .map((conn, idx) => {
                  const connectedId = conn.source === sidebarContent.id ? conn.target : conn.source;
                  const connectedNode = nodesData.find(n => n.id === connectedId);
                  if (!connectedNode) return null;
                  
                  return (
                    <li key={idx} className={`connection-strength-${conn.strength}`}>
                      <span className="connected-node" onClick={() => handleNodeClick(connectedId)}>
                        {connectedNode.label}
                      </span>
                      <span className="connection-type">
                        ({conn.strength} connection)
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
      
      <div className="map-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker core"></div>
            <span>Core System</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker module"></div>
            <span>Module</span>
          </div>
          <div className="legend-item">
            <div className="legend-line connection-strong"></div>
            <span>Strong Connection</span>
          </div>
          <div className="legend-item">
            <div className="legend-line connection-medium"></div>
            <span>Medium Connection</span>
          </div>
          <div className="legend-item">
            <div className="legend-line connection-weak"></div>
            <span>Weak Connection</span>
          </div>
        </div>
        <div className="map-controls">
          <p><strong>Controls:</strong> Click and drag to pan, scroll to zoom, click on nodes to view details</p>
        </div>
      </div>
      
      <div className="map-stats">
        <p>
          <strong>Showing:</strong> {filteredNodes.length} of {nodesData.length} nodes
          {searchTerm && <span> • Search: "{searchTerm}"</span>}
          {typeFilter.length > 0 && (
            <span> • Filters: {typeFilter.map(type => 
              nodeTypes.find(t => t.value === type)?.label).join(', ')}
            </span>
          )}
        </p>
      </div>
      
      {/* Global search panel */}
      {globalSearchActive && (
        <div className="global-search-panel">
          <div className="global-search-container">
            <input
              ref={globalSearchInputRef}
              type="text"
              placeholder="Global search..."
              value={globalSearchQuery}
              onChange={handleGlobalSearchChange}
              onKeyDown={handleGlobalSearchKeyDown}
              className="global-search-input"
            />
            <button className="close-global-search" onClick={() => setGlobalSearchActive(false)}>
              &times;
            </button>
          </div>
          
          {globalSearchResults.length > 0 && (
            <div className="global-search-results">
              <h3>Search Results</h3>
              <ul>
                {globalSearchResults.map(result => (
                  <li key={result.id} className="search-result" onClick={() => handleGlobalSearchResultClick(result)}>
                    <div className="result-title">{result.title}</div>
                    <div className="result-description">{result.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SitrunaKnowledgeMap;
