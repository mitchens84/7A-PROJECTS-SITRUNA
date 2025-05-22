/**
 * Dashboard Storage Manager
 * A global utility for persistent storage across all dashboards
 */
class DashboardStorageManager {
  constructor(namespace = 'dashboards') {
    this.namespace = namespace;
    this._cache = this._loadAllData();
  }
  
  // Save dashboard state
  saveDashboard(dashboardId, data) {
    this._cache[dashboardId] = {
      data: data,
      lastUpdated: new Date().toISOString()
    };
    this._saveAllData();
    return true;
  }
  
  // Load dashboard state
  loadDashboard(dashboardId, defaultState = {}) {
    const savedData = this._cache[dashboardId];
    return savedData ? savedData.data : defaultState;
  }
  
  // Clear a specific dashboard's data
  clearDashboard(dashboardId) {
    if (this._cache[dashboardId]) {
      delete this._cache[dashboardId];
      this._saveAllData();
      return true;
    }
    return false;
  }
  
  // Clear all dashboard data
  clearAllDashboards() {
    this._cache = {};
    localStorage.removeItem(this.namespace);
    return true;
  }
  
  // Private method to load all data from localStorage
  _loadAllData() {
    const saved = localStorage.getItem(this.namespace);
    return saved ? JSON.parse(saved) : {};
  }
  
  // Private method to save all data to localStorage
  _saveAllData() {
    localStorage.setItem(this.namespace, JSON.stringify(this._cache));
  }
}

// Create global instance
const dashboardStorage = new DashboardStorageManager();

// Export for use in all dashboard files
export default dashboardStorage;
