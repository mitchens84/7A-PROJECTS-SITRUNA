import React, { useState, useEffect, useRef } from 'react';
import '../assets/workflow-proposal.css';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
  ChevronDown, ChevronUp, Menu, X, 
  FileText, HelpCircle, Info, Database, 
  BookOpen, BarChart, ArrowUp, Book,
  Image, Download, FileJson, FileSpreadsheet
} from 'lucide-react';

// Helper functions for data export
const exportAsJSON = (data: any[], filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

const exportAsCSV = (data: any[], filename: string) => {
  // Get all unique keys from the data objects
  const keys = Array.from(new Set(
    data.flatMap(item => Object.keys(item))
  ));
  
  // Create CSV header row
  const header = keys.join(',');
  
  // Create CSV rows for each data item
  const rows = data.map(item => {
    return keys.map(key => {
      // Handle commas and quotes in the data
      const value = item[key] !== undefined ? item[key] : '';
      const formattedValue = String(value).includes(',') || String(value).includes('"') 
        ? `"${String(value).replace(/"/g, '""')}"` 
        : value;
      return formattedValue;
    }).join(',');
  });
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n');
  
  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

const AIWorkflowProposal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'overview': true,
    'problem': false,
    'goals': false,
    'metrics': false,
    'graphic-design': false,
    'content-brief': false,
    'case-management': false,
    'listings-upload': false,
    'knowledge': false,
    'capability-assessment': false,
    'implementation': false,
    'references': false
  });
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeExportSection, setActiveExportSection] = useState<string | null>(null);
  
  // Global search state
  const [globalSearchActive, setGlobalSearchActive] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([]);
  
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const headerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 80);
      setShowScrollTop(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add keyboard shortcut for global search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleGlobalSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // Also expand that section
    setExpandedSections({
      ...expandedSections,
      [tab]: true
    });
    
    // Scroll to the section, accounting for fixed header
    if (sectionRefs.current[tab] && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const sectionTop = sectionRefs.current[tab].offsetTop;
      const scrollPosition = sectionTop - headerHeight - 16; // Subtract header height and add a small 16px buffer

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    } else if (sectionRefs.current[tab]) {
      // Fallback if headerRef isn't ready (shouldn't happen often)
      sectionRefs.current[tab].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Table data for the different workflow sections
  const graphicDesignWorkflow = [
    { phase: '1. Ideation', task: 'Generate visual angles', description: 'Creating concepts for lifestyle shots, feature zoom-ins, use cases, and application scenarios', aiRole: 'Generate structured creative concepts based on product specifications and brand guidelines', humanRole: 'Review hooks, remove irrelevant ones, combine ideas', tools: 'Claude 3.7' },
    { phase: '1. Ideation', task: 'Brainstorm layout types', description: 'Developing 3-icon layouts, side-by-side comparisons, and storytelling flows', aiRole: 'Suggest layout options optimized for Amazon marketplace presentation', humanRole: 'Approve, customize to brand tone', tools: 'Claude 3.7' },
    { phase: '2. Brand Profile Structuring', task: 'Analyze previous visuals', description: 'Examining existing imagery to extract tone, layout patterns, and iconography style', aiRole: 'Review image dataset, identify brand tone & visual consistency rules', humanRole: 'Reviews and confirms profile', tools: 'GPT-4o + PKM Tool (Suggested G-Doc)' },
    { phase: '2. Base Image Generation', task: 'Generate product cutout', description: 'Creating isolated product images on neutral backgrounds for versatile use', aiRole: 'Create high-quality product isolation with brand-aligned presentation', humanRole: 'Final crop/resize, refine lighting', tools: 'GPT-4o + PS' },
    { phase: '2. Base Image Generation', task: 'Generate lifestyle mockups', description: 'Creating contextual imagery (e.g kitchen, outdoor, hands using product)', aiRole: 'Generate realistic lifestyle contexts showing product in use', humanRole: 'Discard unrealistic samples, layer brand assets', tools: 'GPT-4o' },
    { phase: '3. Image Refinement', task: 'Background removal/rendering', description: 'Isolating product from backgrounds or creating professional renderings', aiRole: 'Perform object isolation, handle translucent edges, retain fine outlines', humanRole: 'Check isolation quality, fix any edge artifacts', tools: 'GPT-4o + PS' },
    { phase: '3. Image Refinement', task: 'Lighting correction', description: 'Enhancing lighting and shadows for professional product presentation', aiRole: 'Suggest lighting gradients and shadow angles using references', humanRole: 'Verify realism of shadows, adjust depth if needed', tools: 'GPT-4o + PS' }
  ];

  const contentBriefWorkflow = [
    { phase: 'Product Context Framing', task: 'Product feature analysis', description: 'Compiling product features, use cases, materials, and keywords into coherent profile', aiRole: 'Analyze product listing, reviews, and internal docs to generate "Creative Source Profile"', humanRole: 'Approves/edits product summary, add launch notes', tools: 'Claude 3.7' },
    { phase: 'Gallery Brief Generation', task: 'Layout sequence planning', description: 'Creating optimized image flow (Hero → Features → Story → Social Proof)', aiRole: 'Propose 5–7 image ideas with callout suggestions and Amazon-optimized sequencing', humanRole: 'Selects best flow, edits weak ideas', tools: 'Claude 3.7' },
    { phase: 'A+ Content Planning', task: 'Modular layout design', description: 'Creating brand story, feature sets, lifestyle imagery, and CTA structure', aiRole: 'Generate multiple structures with text snippets and image-role suggestions', humanRole: 'Finalizes based on template availability', tools: 'Claude 3.7 + GPT-4o' },
    { phase: 'Storefront Narrative Planning', task: 'Navigation structure development', description: 'Creating section breakdowns, navigation logic, and seasonal banner concepts', aiRole: 'Output a UX-style sitemap and content tone proposal for storefront organization', humanRole: 'Aligns with campaign or brand guideline', tools: 'Claude 3.7' },
    { phase: 'Voice + Copy Drafting', task: 'Brand-aligned text creation', description: 'Generating headlines, benefit overlays, and micro-copy with consistent voice', aiRole: 'Produce tone-specific variants with compliance-safe framing', humanRole: 'Checks tone, grammar, and legal claims', tools: 'GPT-4o' }
  ];

  const caseWalkthroughData = [
    { stage: 'Product Context Extraction', task: 'Profile generation', description: 'Analysis of existing listing, reviews, and keyword documentation', aiRole: 'Process assets to generate comprehensive product summary', humanRole: 'Confirms or adds audience segments (eco buyers, meal preppers)', output: '"Creative Source Profile"' },
    { stage: 'Gallery Sequence Planning', task: 'Narrative structure development', description: 'Creating storyline progression options for optimal customer engagement', aiRole: 'Propose narrative flows (Feature-led, Lifestyle-first, Brand mission intro)', humanRole: 'Chooses "Feature-Led with Emotional CTA" flow', output: 'Image layout plan (7 slides)' },
    { stage: 'Image Module Planning', task: 'Detailed image content planning', description: 'Sequencing specific product highlights in logical progression', aiRole: 'Output detailed modules (Hero, feature demonstrations, sustainability callouts)', humanRole: 'Approves layout, requests visual reference links', output: 'Draft brief with slide-by-slide instructions' },
    { stage: 'Copy Drafting', task: 'Headline and caption creation', description: 'Generating concise, impactful text for image overlays', aiRole: 'Propose short titles and benefit statements (e.g. "Seals Fresh. Stacks Smart.")', humanRole: 'Refines tone to softer, more minimalist voice', output: 'Caption text for overlay' },
    { stage: 'Final Brief Export', task: 'Document preparation', description: 'Compiling all elements into designer-ready document', aiRole: 'Assemble brief into Google Doc format for the design team', humanRole: 'Reviews for readiness', output: 'Brief sent to designer' }
  ];

  const caseManagementWorkflow = [
    { phase: '1. Intake & Categorization', task: 'Issue classification', description: 'Identifying case type (suspension, listing error, FBA refund, policy appeal)', aiRole: 'Parse intake message and classify into known issue types using template library', humanRole: 'Confirm correct categorization, escalate if needed. *High-level expertise involved', tools: 'GPT 4o' },
    { phase: '2. Case Research', task: 'Precedent identification', description: 'Finding relevant successful case examples and resolution patterns', aiRole: 'Surface relevant examples tagged by resolution type from knowledge base', humanRole: 'Evaluates precedent validity and adjusts argument angle. *High-level expertise involved', tools: 'Claude 3.7 + Airtable' },
    { phase: '3. Drafting & Framing', task: 'Case construction', description: 'Writing case in Amazon\'s preferred tone and structure (issue → evidence → ask)', aiRole: 'Auto-structure draft using known format logic and compliance language', humanRole: 'Edits, adds nuance, and fact-checks', tools: 'GPT-4o' },
    { phase: '4. QA & Submission', task: 'Quality assurance', description: 'Validating tone, clarity, and compliance language before submission', aiRole: 'Cross check for compliance and flags mis-alignment', humanRole: 'Validates and uploads through Amazon portal', tools: 'GPT-4o' }
  ];

  const listingsUploadWorkflow = [
    { phase: '1. Data Intake', task: 'Product data collection', description: 'Gathering all product details (title, bullets, specs, images, backend fields)', aiRole: 'Parse unstructured data into standardized JSON or tabular format', humanRole: 'Confirm data completeness, add product nuance', tools: 'Gemini 2.5 + Google Sheets' },
    { phase: '2. Template Preparation', task: 'Template retrieval', description: 'Obtaining correct flat file template based on product category', aiRole: 'Automate lookup from Amazon template library', humanRole: 'Download from Seller Central; validate template version', tools: 'Gemini 2.5' },
    { phase: '2. Template Preparation', task: 'Field requirement analysis', description: 'Identifying required and optional fields with specifications', aiRole: 'Outline field priorities per category with compliance requirements', humanRole: 'Confirm field mapping, adjust if needed', tools: 'Gemini 2.5' },
    { phase: '3. Field Mapping', task: 'Attribute alignment', description: 'Matching product data to correct Amazon template fields', aiRole: 'Align extracted values to correct field headers in template structure', humanRole: 'Confirm logic and correct edge-case mappings', tools: 'Gemini 2.5' }
  ];

  const knowledgeManagementSystem = [
    { component: 'Structured Knowledge Base', purpose: 'Organize Amazon policies, best practices, and brand guidelines', implementation: 'Claude-indexed Google Drive or other database', benefit: 'Single source of truth for all AI operations' },
    { component: 'AI Project Configuration', purpose: 'Set up dedicated AI projects with specialized training', implementation: 'Project-specific instruction sets with role definitions and specialized knowledge', benefit: 'Consistent AI outputs aligned with specific workflow needs' },
    { component: 'Custom Instruction Libraries', purpose: 'Develop standardized prompts for recurring tasks', implementation: 'Task-specific instruction templates with embedded Amazon knowledge', benefit: 'Reproducible high-quality results with minimal training' },
    { component: 'Enterprise AI Account Management', purpose: 'Configure shared AI accounts with appropriate permissions', implementation: 'Team accounts with role-based access and activity tracking', benefit: 'Cost-effective AI access with appropriate oversight' }
  ];

  // AI Capability Assessment data
  const capabilityAssessment = [
    { 
      capability: 'Classification & Categorization', 
      maturity: 'High', 
      evidence: 'All proposed models demonstrate strong classification performance (65-72% base accuracy), with potential for greater than 90% accuracy after fine-tuning. This capability is well-established and reliable for the case management workflows.',
      implementation: 'Begin implementation immediately, with domain-specific fine-tuning to boost accuracy further'
    },
    { 
      capability: 'Structured Data Extraction', 
      maturity: 'High', 
      evidence: 'Gemini 2.5\'s 84% accuracy on structured data extraction tasks (GPQA benchmark) provides strong evidence that the listings upload workflow is technically feasible, particularly for standardized product data.',
      implementation: 'Implement with standardized input templates and validation checks'
    },
    { 
      capability: 'Content Compliance & Quality Assessment', 
      maturity: 'High', 
      evidence: 'Character limit validation and formatting checks show near-perfect accuracy across all models, making the QA components of the workflows highly reliable.',
      implementation: 'Deploy with confidence for verification tasks and compliance checks'
    },
    { 
      capability: 'Creative Content Generation', 
      maturity: 'Medium', 
      evidence: "Claude 3.7 shows strong general performance in creative writing tasks and appears capable of generating structured creative concepts, though specific benchmarks for e-commerce creative briefs aren't available.",
      implementation: 'Implement with human supervision and approval workflows'
    }
  ];

  // References list
  const references = [
    { id: 1, citation: "Anthropic. \"Introducing the next generation of Claude.\" Anthropic." },
    { id: 2, citation: "Geeky Gadgets. \"Claude 3.7 Review: Advanced AI for Coding and Creative Writing.\" Geeky Gadgets." },
    { id: 3, citation: "OpenAI. \"Hello GPT-4o.\" OpenAI." },
    { id: 4, citation: "Research team. \"GPT-ImgEval: A Comprehensive Benchmark for Diagnosing GPT-4o.\" arXiv." },
    { id: 5, citation: "Writesonic Blog. \"GPT-4.5 vs GPT-4o: Testing The AI Models Using Seven Prompts.\" Writesonic." },
    { id: 6, citation: "Swiftask AI. \"Gemini 2.5 Pro: Google's ultimate intelligence.\" Swiftask AI." }
  ];

  // Filter workflow data based on search term
  const filterWorkflowData = (data: any[], term: string) => {
    if (!term) return data;
    
    return data.filter(item => 
      Object.values(item).some(value => 
        value !== null && value !== undefined && 
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  // Global search function that searches across all workflow data
  const performGlobalSearch = (query: string) => {
    if (!query.trim()) {
      setGlobalSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: any[] = [];

    // Search in graphic design workflow
    graphicDesignWorkflow.forEach(item => {
      if (Object.values(item).some(value => 
        value !== null && value !== undefined && 
        String(value).toLowerCase().includes(lowerQuery)
      )) {
        results.push({
          ...item,
          section: 'graphic-design',
          sectionName: 'Graphic Design Workflow'
        });
      }
    });

    // Search in content brief workflow
    contentBriefWorkflow.forEach(item => {
      if (Object.values(item).some(value => 
        value !== null && value !== undefined && 
        String(value).toLowerCase().includes(lowerQuery)
      )) {
        results.push({
          ...item,
          section: 'content-brief',
          sectionName: 'Content Brief Workflow'
        });
      }
    });

    // Search in case management workflow
    caseManagementWorkflow.forEach(item => {
      if (Object.values(item).some(value => 
        value !== null && value !== undefined && 
        String(value).toLowerCase().includes(lowerQuery)
      )) {
        results.push({
          ...item,
          section: 'case-management',
          sectionName: 'Case Management Workflow'
        });
      }
    });

    // Search in listings upload workflow
    listingsUploadWorkflow.forEach(item => {
      if (Object.values(item).some(value => 
        value !== null && value !== undefined && 
        String(value).toLowerCase().includes(lowerQuery)
      )) {
        results.push({
          ...item,
          section: 'listings-upload',
          sectionName: 'Listings Upload Workflow'
        });
      }
    });

    setGlobalSearchResults(results);
  };

  // Handle global search input
  const handleGlobalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setGlobalSearchQuery(query);
    performGlobalSearch(query);
  };

  // Toggle global search visibility
  const toggleGlobalSearch = () => {
    setGlobalSearchActive(!globalSearchActive);
    // Focus the search input when opening
    if (!globalSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closing
      setGlobalSearchQuery('');
      setGlobalSearchResults([]);
    }
  };

  // Navigate to search result section
  const navigateToResult = (section: string) => {
    handleTabClick(section);
    setGlobalSearchActive(false);
    setGlobalSearchQuery('');
    setGlobalSearchResults([]);
  };

  // Get the correct data for export based on section name
  const getExportData = (section: string) => {
    switch(section) {
      case 'graphic-design':
        return graphicDesignWorkflow;
      case 'content-brief':
        return contentBriefWorkflow;
      case 'case-study':
        return caseWalkthroughData;
      case 'case-management':
        return caseManagementWorkflow;
      case 'listings-upload':
        return listingsUploadWorkflow;
      case 'knowledge':
        return knowledgeManagementSystem;
      case 'capability-assessment':
        return capabilityAssessment;
      case 'references':
        return references;
      default:
        return [];
    }
  };

  // Handle export actions
  const handleExport = (section: string, format: 'json' | 'csv') => {
    const data = getExportData(section);
    const filename = `${section}-workflow-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'json') {
      exportAsJSON(data, filename);
    } else {
      exportAsCSV(data, filename);
    }
    
    // Close export dropdown after export
    setActiveExportSection(null);
  };

  // Toggle export dropdown for a section
  const toggleExportDropdown = (section: string) => {
    setActiveExportSection(activeExportSection === section ? null : section);
  };

  // Export UI component
  const ExportDropdown = ({ section }: { section: string }) => (
    <div className="export-dropdown-container">
      <button 
        className="export-button"
        onClick={() => toggleExportDropdown(section)}
      >
        <Download size={16} />
        Export
      </button>
      
      {activeExportSection === section && (
        <div className="export-dropdown">
          <button 
            className="export-option"
            onClick={() => handleExport(section, 'json')}
          >
            <FileJson size={16} /> Export as JSON
          </button>
          <button 
            className="export-option"
            onClick={() => handleExport(section, 'csv')}
          >
            <FileSpreadsheet size={16} /> Export as CSV
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="workflow-proposal">
      <Breadcrumbs />
      <div 
        ref={headerRef} 
        className={`proposal-header ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="header-content">
          <h1 className="proposal-title">AI-Enhanced E-commerce Workflows</h1>
          <p className="proposal-subtitle">Structured approach to implementing AI in e-commerce operations</p>
          
          <div className="header-controls">
            <button 
              className="global-search-button"
              onClick={toggleGlobalSearch}
              title="Search the document (Ctrl+K / Cmd+K)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
            
            {globalSearchActive && (
              <div className="global-search-overlay" onClick={toggleGlobalSearch}>
                <div className="global-search-container" onClick={(e) => e.stopPropagation()}>
                  <div className="global-search-input-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="global-search-input"
                      placeholder="Search workflows, tasks, tools..."
                      value={globalSearchQuery}
                      onChange={handleGlobalSearchChange}
                    />
                    <button 
                      className="global-search-close"
                      onClick={toggleGlobalSearch}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {globalSearchResults.length > 0 && (
                    <div className="global-search-results">
                      {globalSearchResults.map((result, index) => (
                        <div 
                          key={index} 
                          className="global-search-result"
                          onClick={() => navigateToResult(result.section)}
                        >
                          <div className="result-section">{result.sectionName}</div>
                          <div className="result-task">{result.task}</div>
                          <div className="result-phase">{result.phase}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {globalSearchQuery.trim() !== '' && globalSearchResults.length === 0 && (
                    <div className="global-search-no-results">
                      No results found for "{globalSearchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className={`tab-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabClick('overview')}
              >
                <Info size={16} /> Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'graphic-design' ? 'active' : ''}`}
                onClick={() => handleTabClick('graphic-design')}
              >
                <Image size={16} /> Graphic Design
              </button>
              <button 
                className={`tab-button ${activeTab === 'content-brief' ? 'active' : ''}`}
                onClick={() => handleTabClick('content-brief')}
              >
                <FileText size={16} /> Content Brief
              </button>
              <button 
                className={`tab-button ${activeTab === 'case-management' ? 'active' : ''}`}
                onClick={() => handleTabClick('case-management')}
              >
                <HelpCircle size={16} /> Case Management
              </button>
              <button 
                className={`tab-button ${activeTab === 'listings-upload' ? 'active' : ''}`}
                onClick={() => handleTabClick('listings-upload')}
              >
                <Database size={16} /> Listings Upload
              </button>
              <button 
                className={`tab-button ${activeTab === 'knowledge' ? 'active' : ''}`}
                onClick={() => handleTabClick('knowledge')}
              >
                <BookOpen size={16} /> Knowledge System
              </button>
              <button 
                className={`tab-button ${activeTab === 'capability-assessment' ? 'active' : ''}`}
                onClick={() => handleTabClick('capability-assessment')}
              >
                <BarChart size={16} /> Capability Assessment
              </button>
              <button 
                className={`tab-button ${activeTab === 'references' ? 'active' : ''}`}
                onClick={() => handleTabClick('references')}
              >
                <Book size={16} /> References
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="proposal-content">
        {/* Overview Section */}
        <div 
          ref={el => sectionRefs.current['overview'] = el} 
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('overview')}
          >
            <h2 className="section-title">
              <Info size={20} /> Overview
            </h2>
            {expandedSections['overview'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['overview'] ? 'expanded' : ''}`}>
            <p>This proposal outlines a structured approach to implementing AI-enhanced workflows across key e-commerce operational areas. Based on extensive capability assessment and process modeling, we've developed specific implementation plans for the following areas:</p>
            
            <ul>
              <li><strong>Graphic Design:</strong> AI-assisted product imagery creation</li>
              <li><strong>Content Brief Generation:</strong> Automated creative direction for listings</li>
              <li><strong>Case Management:</strong> AI-augmented suspension and policy appeals</li>
              <li><strong>Listings Upload:</strong> Automated data extraction and templating</li>
            </ul>
            
            <p>Each workflow is designed to maximize human-AI collaboration, with AI handling routine tasks while humans provide strategic direction and quality control. The implementation will be phased based on capability maturity, enabling quick wins while building toward more advanced applications.</p>
          </div>
        </div>

        {/* Graphic Design Workflow Section */}
        <div 
          ref={el => sectionRefs.current['graphic-design'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('graphic-design')}
          >
            <h2 className="section-title">
              <Image size={20} /> Graphic Design Workflow
            </h2>
            {expandedSections['graphic-design'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['graphic-design'] ? 'expanded' : ''}`}>
            <div className="search-bar">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search workflow tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="filter-dropdown"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
              >
                <option value="">All Phases</option>
                <option value="1. Ideation">1. Ideation</option>
                <option value="2. Brand Profile">2. Brand Profile</option>
                <option value="3. Image Refinement">3. Image Refinement</option>
              </select>
            </div>
            
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>AI Role</th>
                  <th>Human Role</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {filterWorkflowData(graphicDesignWorkflow, searchQuery || filterTerm).map((item, index) => (
                  <tr key={index}>
                    <td>{item.phase}</td>
                    <td>{item.task}</td>
                    <td>{item.description}</td>
                    <td>{item.aiRole}</td>
                    <td>{item.humanRole}</td>
                    <td>{item.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ExportDropdown section="graphic-design" />
          </div>
        </div>

        {/* Content Brief Workflow Section */}
        <div 
          ref={el => sectionRefs.current['content-brief'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('content-brief')}
          >
            <h2 className="section-title">
              <FileText size={20} /> Content Brief Workflow
            </h2>
            {expandedSections['content-brief'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['content-brief'] ? 'expanded' : ''}`}>
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>AI Role</th>
                  <th>Human Role</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {contentBriefWorkflow.map((item, index) => (
                  <tr key={index}>
                    <td>{item.phase}</td>
                    <td>{item.task}</td>
                    <td>{item.description}</td>
                    <td>{item.aiRole}</td>
                    <td>{item.humanRole}</td>
                    <td>{item.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="section-subheader">
              <h3>Case Walkthrough: Food Container Creative Brief</h3>
            </div>
            
            <div className="case-flow">
              {caseWalkthroughData.map((item, index) => (
                <div className="case-step" key={index}>
                  <div className="case-stage">{item.stage}</div>
                  <div className="case-task">{item.task}</div>
                  <p>{item.description}</p>
                  <div className="case-role">
                    <div>
                      <div className="role-label">AI Role:</div>
                      <div className="role-description">{item.aiRole}</div>
                    </div>
                    <div>
                      <div className="role-label">Human Role:</div>
                      <div className="role-description">{item.humanRole}</div>
                    </div>
                  </div>
                  <div className="case-output">Output: {item.output}</div>
                </div>
              ))}
            </div>

            <ExportDropdown section="content-brief" />
          </div>
        </div>
        
        {/* Case Management Workflow Section */}
        <div 
          ref={el => sectionRefs.current['case-management'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('case-management')}
          >
            <h2 className="section-title">
              <HelpCircle size={20} /> Case Management Workflow
            </h2>
            {expandedSections['case-management'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['case-management'] ? 'expanded' : ''}`}>
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>AI Role</th>
                  <th>Human Role</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {caseManagementWorkflow.map((item, index) => (
                  <tr key={index}>
                    <td>{item.phase}</td>
                    <td>{item.task}</td>
                    <td>{item.description}</td>
                    <td>{item.aiRole}</td>
                    <td>{item.humanRole}</td>
                    <td>{item.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ExportDropdown section="case-management" />
          </div>
        </div>
        
        {/* Listings Upload Workflow Section */}
        <div 
          ref={el => sectionRefs.current['listings-upload'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('listings-upload')}
          >
            <h2 className="section-title">
              <Database size={20} /> Listings Upload Workflow
            </h2>
            {expandedSections['listings-upload'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['listings-upload'] ? 'expanded' : ''}`}>
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>AI Role</th>
                  <th>Human Role</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {listingsUploadWorkflow.map((item, index) => (
                  <tr key={index}>
                    <td>{item.phase}</td>
                    <td>{item.task}</td>
                    <td>{item.description}</td>
                    <td>{item.aiRole}</td>
                    <td>{item.humanRole}</td>
                    <td>{item.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ExportDropdown section="listings-upload" />
          </div>
        </div>
        
        {/* Knowledge Management System Section */}
        <div 
          ref={el => sectionRefs.current['knowledge'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('knowledge')}
          >
            <h2 className="section-title">
              <BookOpen size={20} /> Knowledge Management System
            </h2>
            {expandedSections['knowledge'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['knowledge'] ? 'expanded' : ''}`}>
            <p>A robust knowledge management system is critical for consistent AI operations. The following components will be implemented:</p>
            
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Purpose</th>
                  <th>Implementation</th>
                  <th>Benefit</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeManagementSystem.map((item, index) => (
                  <tr key={index}>
                    <td>{item.component}</td>
                    <td>{item.purpose}</td>
                    <td>{item.implementation}</td>
                    <td>{item.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Capability Assessment Section */}
        <div 
          ref={el => sectionRefs.current['capability-assessment'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('capability-assessment')}
          >
            <h2 className="section-title">
              <BarChart size={20} /> AI Capability Assessment
            </h2>
            {expandedSections['capability-assessment'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['capability-assessment'] ? 'expanded' : ''}`}>
            <p>Based on current AI model benchmarks and testing, we've assessed the maturity of key capabilities required for these workflows:</p>
            
            {capabilityAssessment.map((item, index) => (
              <div className="capability-card" key={index}>
                <div className="capability-header">
                  <h3 className="capability-title">{item.capability}</h3>
                  <span className={`maturity-badge maturity-${item.maturity.toLowerCase()}`}>{item.maturity}</span>
                </div>
                <p>{item.evidence}</p>
                <p><strong>Implementation recommendation:</strong> {item.implementation}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* References Section */}
        <div 
          ref={el => sectionRefs.current['references'] = el}
          className="section"
        >
          <div 
            className="section-header" 
            onClick={() => toggleSection('references')}
          >
            <h2 className="section-title">
              <Book size={20} /> References
            </h2>
            {expandedSections['references'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div className={`section-content ${expandedSections['references'] ? 'expanded' : ''}`}>
            <ol className="reference-list">
              {references.map((item) => (
                <li key={item.id} className="reference-item">{item.citation}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      
      {/* Quick Navigation */}
      <div className="quick-nav">
        <button 
          className="quick-nav-toggle"
          onClick={() => setQuickNavOpen(!quickNavOpen)}
        >
          {quickNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className={`quick-nav-menu ${quickNavOpen ? 'open' : ''}`}>
          <div className="quick-nav-item" onClick={() => handleTabClick('overview')}>
            <Info size={16} /> Overview
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('graphic-design')}>
            <Image size={16} /> Graphic Design
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('content-brief')}>
            <FileText size={16} /> Content Brief
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('case-management')}>
            <HelpCircle size={16} /> Case Management
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('listings-upload')}>
            <Database size={16} /> Listings Upload
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('knowledge')}>
            <BookOpen size={16} /> Knowledge System
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('capability-assessment')}>
            <BarChart size={16} /> Capability Assessment
          </div>
          <div className="quick-nav-item" onClick={() => handleTabClick('references')}>
            <Book size={16} /> References
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <button 
        className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default AIWorkflowProposal;
