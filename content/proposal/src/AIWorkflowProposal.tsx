import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronUp, Menu, X, Workflow, Check, AlertCircle, Settings,
  FileText, Image, HelpCircle, Info, Search, Filter, ArrowRight, Database,
  BookOpen, BarChart, RefreshCw, Award, Zap, LifeBuoy, PieChart, Layers,
  ArrowUp, Book, FileCheck, Lightbulb, Target
} from 'lucide-react';

const AIWorkflowProposal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    problem: false,
    goals: false,
    metrics: false,
    'graphic-design': false,
    'content-brief': false,
    'case-management': false,
    'listings-upload': false,
    knowledge: false,
    'capability-assessment': false,
    implementation: false,
    references: false,
  });
  const [filterTerm, setFilterTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement>>({});
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 80);
      setShowScrollTop(scrollPosition > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setExpandedSections(prev => ({ ...prev, [tab]: true }));
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const sectionEl = sectionRefs.current[tab];
    if (sectionEl) {
      const top = sectionEl.offsetTop - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterWorkflowData = (data: any[], term: string) => {
    if (!term) return data;
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  // Data definitions omitted for brevity...
  // (Use the data arrays from the original proposal.tsx here.)

  // Render functions omitted for brevity...
  // (Use the renderWorkflowStats, WorkflowVisualization, renderTable, ExecutiveSummary functions as in strategy.)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      {/* ... */}
      <main className="container mx-auto px-4 py-8 pt-28">
        {/* Sections */}
      </main>
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8 mt-8">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default AIWorkflowProposal;
