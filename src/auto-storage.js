import dashboardStorage from './storage-manager.js';

/**
 * AutoStorage - Automatically handles storage for all dashboard elements
 */
class AutoStorage {
  constructor() {
    // Check for debug mode
    this.debugMode = localStorage.getItem('debug-storage') === 'true';
    this.dashboardId = this.detectDashboardId();
    this.setupMutationObserver();
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  // Logging helper that respects debug mode
  log(...args) {
    if (this.debugMode) {
      console.log(`[AutoStorage]`, ...args);
    }
  }
  
  // Warning helper that always shows
  warn(...args) {
    console.warn(`[AutoStorage]`, ...args);
  }
  
  // Detect dashboard ID from filename, URL, or document title
  detectDashboardId() {
    // Try to get from current script path
    const scriptPath = document.currentScript?.src?.split('/').pop()?.replace('.js', '');
    if (scriptPath && scriptPath !== 'auto-storage') {
      this.log(`Dashboard ID from script path: ${scriptPath}`);
      return scriptPath;
    }
    
    // Try from page URL
    const urlPath = window.location.pathname.split('/').pop()?.replace('.html', '');
    if (urlPath) {
      this.log(`Dashboard ID from URL path: ${urlPath}`);
      return urlPath;
    }
    
    // Fallback to document title or fixed string
    const titleId = document.title ? document.title.toLowerCase().replace(/\s+/g, '-') : 'dashboard';
    this.log(`Dashboard ID from document title: ${titleId}`);
    return titleId;
  }
  
  // Initialize storage
  init() {
    this.log(`AutoStorage initialized for "${this.dashboardId}"`);
    
    // Load saved state
    const savedState = dashboardStorage.loadDashboard(this.dashboardId, {});
    this.log(`Loading saved state for "${this.dashboardId}":`, savedState);
    
    // Apply saved state if exists
    if (Object.keys(savedState).length > 0) {
      this.applyState(savedState);
    }
    
    // Set up listeners for all interactive elements
    this.setupEventListeners();
    
    // Import legacy data if it exists
    this.importLegacyStorageData();
    
    // Add storage indicator to page if in debug mode
    if (this.debugMode) {
      this.addDebugIndicator();
    }
  }
  
  // Add visual indicator for debug mode
  addDebugIndicator() {
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '5px';
    indicator.style.fontSize = '12px';
    indicator.style.zIndex = '9999';
    indicator.style.cursor = 'pointer';
    indicator.textContent = `📦 Storage: ${this.dashboardId}`;
    
    indicator.addEventListener('click', () => {
      console.log('[AutoStorage] Current state:', dashboardStorage.loadDashboard(this.dashboardId, {}));
    });
    
    document.body.appendChild(indicator);
  }
  
  // Import data from the old SimpleStorage format
  importLegacyStorageData() {
    // Check for legacy checkbox data
    const legacyKey = `${this.dashboardId}-checkboxes`;
    try {
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData) {
        const checkboxes = JSON.parse(legacyData);
        this.log(`Found legacy checkbox data for "${this.dashboardId}":`, checkboxes);
        
        // Apply legacy checkbox states to elements
        let migrationCount = 0;
        Object.keys(checkboxes).forEach(id => {
          const checkbox = this.findElementById(id);
          if (checkbox) {
            checkbox.checked = checkboxes[id];
            migrationCount++;
          }
        });
        
        if (migrationCount > 0) {
          this.log(`Migrated ${migrationCount} checkboxes from legacy storage`);
          // Save current state to new format and remove legacy data
          this.saveCurrentState();
          localStorage.removeItem(legacyKey);
        }
      }
    } catch (e) {
      this.warn('Error importing legacy storage data:', e);
    }
  }
  
  // Watch for DOM changes to attach event listeners to new elements
  setupMutationObserver() {
    const observer = new MutationObserver(mutations => {
      let shouldUpdateListeners = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldUpdateListeners = true;
        }
      });
      
      if (shouldUpdateListeners) {
        this.log('DOM mutation detected, setting up listeners for new elements');
        this.setupEventListeners();
      }
    });
    
    // Start observing once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    } else {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  
  // Add event listeners to all interactive elements
  setupEventListeners() {
    let newBindings = 0;
    
    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      if (!checkbox.hasAttribute('data-storage-bound')) {
        checkbox.setAttribute('data-storage-bound', 'true');
        checkbox.addEventListener('change', () => {
          this.log(`Checkbox changed: ${this.getElementIdentifier(checkbox) || 'unnamed'} = ${checkbox.checked}`);
          this.saveCurrentState();
        });
        newBindings++;
      }
    });
    
    // Text inputs and textareas
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea').forEach(input => {
      if (!input.hasAttribute('data-storage-bound')) {
        input.setAttribute('data-storage-bound', 'true');
        input.addEventListener('change', () => this.saveCurrentState());
        input.addEventListener('blur', () => this.saveCurrentState());
        newBindings++;
      }
    });
    
    // Select dropdowns
    document.querySelectorAll('select').forEach(select => {
      if (!select.hasAttribute('data-storage-bound')) {
        select.setAttribute('data-storage-bound', 'true');
        select.addEventListener('change', () => this.saveCurrentState());
        newBindings++;
      }
    });
    
    // Radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      if (!radio.hasAttribute('data-storage-bound')) {
        radio.setAttribute('data-storage-bound', 'true');
        radio.addEventListener('change', () => this.saveCurrentState());
        newBindings++;
      }
    });
    
    // Collapsible sections (if they have a standard class)
    document.querySelectorAll('.collapsible, .accordion, [data-collapsible]').forEach(section => {
      if (!section.hasAttribute('data-storage-bound')) {
        section.setAttribute('data-storage-bound', 'true');
        section.addEventListener('toggle', () => this.saveCurrentState());
        newBindings++;
      }
    });
    
    // Tab panels or custom UI components
    document.querySelectorAll('[role="tabpanel"], [data-tab-panel], .tab-content').forEach(tabPanel => {
      if (!tabPanel.hasAttribute('data-storage-bound')) {
        tabPanel.setAttribute('data-storage-bound', 'true');
        // Create a MutationObserver for class changes that might indicate active state
        const tabObserver = new MutationObserver(() => this.saveCurrentState());
        tabObserver.observe(tabPanel, { attributes: true, attributeFilter: ['class'] });
        newBindings++;
      }
    });
    
    if (newBindings > 0) {
      this.log(`Bound storage to ${newBindings} new element(s)`);
    }
  }
  
  // Collect all form data
  collectCurrentState() {
    const state = {
      checkboxes: {},
      inputs: {},
      selects: {},
      radios: {},
      collapsibles: {},
      tabs: {}
    };
    
    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
      // Get identifier or generate one if not available
      const id = this.getElementIdentifier(checkbox) || this.generateElementId(checkbox, index);
      if (id) {
        state.checkboxes[id] = checkbox.checked;
      }
    });
    
    // Text inputs and textareas
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea').forEach(input => {
      const id = this.getElementIdentifier(input);
      if (id) {
        state.inputs[id] = input.value;
      }
    });
    
    // Select dropdowns
    document.querySelectorAll('select').forEach(select => {
      const id = this.getElementIdentifier(select);
      if (id) {
        state.selects[id] = select.value;
      }
    });
    
    // Radio buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
      const name = radio.name;
      if (name) {
        state.radios[name] = radio.value;
      }
    });
    
    // Collapsible sections
    document.querySelectorAll('.collapsible, .accordion, [data-collapsible]').forEach(section => {
      const id = this.getElementIdentifier(section);
      if (id) {
        state.collapsibles[id] = !section.classList.contains('collapsed');
      }
    });
    
    // Tab panels
    document.querySelectorAll('[role="tabpanel"], [data-tab-panel], .tab-content').forEach(tabPanel => {
      const id = this.getElementIdentifier(tabPanel);
      if (id && tabPanel.classList.contains('active')) {
        state.tabs[id] = true;
      }
    });
    
    return state;
  }
  
  // Apply state to all elements
  applyState(state) {
    let appliedCount = 0;
    let failedCount = 0;
    
    // Apply checkbox states
    for (const [id, isChecked] of Object.entries(state.checkboxes || {})) {
      const checkbox = this.findElementById(id);
      if (checkbox) {
        checkbox.checked = isChecked;
        this.log(`Applied state to checkbox ${id}: ${isChecked}`);
        appliedCount++;
      } else {
        this.debugMode && this.warn(`Could not find checkbox with ID: ${id}`);
        failedCount++;
      }
    }
    
    // Apply input values
    for (const [id, value] of Object.entries(state.inputs || {})) {
      const input = this.findElementById(id);
      if (input) {
        input.value = value;
        appliedCount++;
      } else {
        failedCount++;
      }
    }
    
    // Apply select values
    for (const [id, value] of Object.entries(state.selects || {})) {
      const select = this.findElementById(id);
      if (select) {
        select.value = value;
        appliedCount++;
      } else {
        failedCount++;
      }
    }
    
    // Apply radio button selections
    for (const [name, value] of Object.entries(state.radios || {})) {
      const radio = document.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
      if (radio) {
        radio.checked = true;
        appliedCount++;
      } else {
        failedCount++;
      }
    }
    
    // Apply collapsible states
    for (const [id, isExpanded] of Object.entries(state.collapsibles || {})) {
      const section = this.findElementById(id);
      if (section) {
        if (isExpanded) {
          section.classList.remove('collapsed');
        } else {
          section.classList.add('collapsed');
        }
        appliedCount++;
      } else {
        failedCount++;
      }
    }
    
    // Apply tab states
    for (const [id] of Object.entries(state.tabs || {})) {
      const tab = this.findElementById(id);
      if (tab) {
        // Find all siblings and deactivate them first
        const siblings = Array.from(tab.parentNode?.children || []);
        siblings.forEach(sibling => {
          sibling.classList.remove('active');
          sibling.setAttribute('aria-selected', 'false');
        });
        
        // Activate this tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        
        // Activate corresponding tab button if possible
        const tabId = tab.getAttribute('aria-labelledby') || tab.id;
        if (tabId) {
          const tabButton = document.querySelector(`[aria-controls="${tabId}"]`);
          if (tabButton) {
            const tabButtons = Array.from(tabButton.parentNode?.children || []);
            tabButtons.forEach(btn => {
              btn.classList.remove('active');
              btn.setAttribute('aria-selected', 'false');
            });
            tabButton.classList.add('active');
            tabButton.setAttribute('aria-selected', 'true');
          }
        }
        
        appliedCount++;
      } else {
        failedCount++;
      }
    }
    
    this.log(`Applied saved state to ${appliedCount} element(s), ${failedCount} element(s) not found`);
  }
  
  // Get a unique identifier for an element
  getElementIdentifier(element) {
    return element.id || element.name || element.getAttribute('data-id');
  }
  
  // Generate a reliable identifier for elements without explicit IDs
  generateElementId(element, index) {
    // Try to use parent element IDs to create a stable path
    const path = [];
    let currentNode = element;
    let depth = 0;
    
    // Build a path up to 3 levels deep or until we find an element with an ID
    while (currentNode && depth < 3) {
      if (currentNode.id) {
        path.unshift(currentNode.id);
        break;
      }
      
      if (currentNode.tagName) {
        // Count siblings of same type to get stable index
        const siblings = Array.from(currentNode.parentNode?.children || [])
          .filter(node => node.tagName === currentNode.tagName);
        const siblingIndex = siblings.indexOf(currentNode);
        
        path.unshift(`${currentNode.tagName.toLowerCase()}:${siblingIndex}`);
      }
      
      currentNode = currentNode.parentNode;
      depth++;
    }
    
    if (path.length > 0) {
      // Create a stable path identifier
      const pathId = `path:${path.join('>')}`;
      this.log(`Generated path ID for element: ${pathId}`);
      return pathId;
    }
    
    // Fallback to a data attribute to mark this element
    const generatedId = `auto-id-${Math.random().toString(36).substring(2, 10)}`;
    element.setAttribute('data-auto-id', generatedId);
    this.log(`Generated random ID for element: ${generatedId}`);
    return generatedId;
  }
  
  // Find element by various identifiers
  findElementById(id) {
    // Handle path-based identifiers
    if (id.startsWith('path:')) {
      return this.findElementByPath(id.substring(5));
    }
    
    // Handle regular identifiers
    return document.getElementById(id) || 
           document.querySelector(`[name="${id}"]`) || 
           document.querySelector(`[data-id="${id}"]`) ||
           document.querySelector(`[data-auto-id="${id}"]`);
  }
  
  // Find element by generated path
  findElementByPath(pathString) {
    const pathParts = pathString.split('>');
    
    // If path starts with an ID, that's our starting point
    let startElement = null;
    const firstPart = pathParts[0];
    
    if (!firstPart.includes(':')) {
      // This is a direct ID
      startElement = document.getElementById(firstPart);
      pathParts.shift(); // Remove the ID part
    } else {
      // Start from document body
      startElement = document.body;
    }
    
    if (!startElement || pathParts.length === 0) return null;
    
    // Follow the path
    let currentElement = startElement;
    
    for (const part of pathParts) {
      if (!currentElement) break;
      
      // Parse tagName and index
      const [tagName, indexStr] = part.split(':');
      const index = parseInt(indexStr, 10);
      
      // Find all children matching the tag
      const matchingChildren = Array.from(currentElement.children)
        .filter(child => child.tagName.toLowerCase() === tagName.toLowerCase());
      
      if (matchingChildren[index]) {
        currentElement = matchingChildren[index];
      } else {
        // Path is no longer valid
        return null;
      }
    }
    
    return currentElement;
  }
  
  // Save current state
  saveCurrentState() {
    const state = this.collectCurrentState();
    dashboardStorage.saveDashboard(this.dashboardId, state);
    this.log(`Saved state for "${this.dashboardId}"`);
    
    // Dispatch a custom event that other code can listen for
    const event = new CustomEvent('autostorage:save', { 
      detail: { dashboardId: this.dashboardId, state } 
    });
    document.dispatchEvent(event);
  }
  
  // Public API for forcing a state update
  forceUpdate() {
    this.saveCurrentState();
  }
}

// Initialize auto-storage
const autoStorage = new AutoStorage();

// Make it available globally
window.autoStorage = autoStorage;

export default autoStorage;
