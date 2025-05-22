/**
 * Content versioning utilities
 */

export interface VersionInfo {
  versionId: string;
  timestamp: string;
  author: string;
  comment: string;
}

export interface VersionedContent<T> {
  current: T;
  versions: {
    [versionId: string]: T;
  };
  versionHistory: VersionInfo[];
}

/**
 * Create a new versioned content object
 */
export function createVersionedContent<T>(initialContent: T, author: string = 'system'): VersionedContent<T> {
  const initialVersionId = generateVersionId();
  const timestamp = new Date().toISOString();
  
  return {
    current: initialContent,
    versions: {
      [initialVersionId]: initialContent
    },
    versionHistory: [
      {
        versionId: initialVersionId,
        timestamp,
        author,
        comment: 'Initial version'
      }
    ]
  };
}

/**
 * Add a new version to a versioned content object
 */
export function addVersion<T>(
  versionedContent: VersionedContent<T>, 
  newContent: T, 
  author: string, 
  comment: string
): VersionedContent<T> {
  const versionId = generateVersionId();
  const timestamp = new Date().toISOString();
  
  return {
    current: newContent,
    versions: {
      ...versionedContent.versions,
      [versionId]: newContent
    },
    versionHistory: [
      {
        versionId,
        timestamp,
        author,
        comment
      },
      ...versionedContent.versionHistory
    ]
  };
}

/**
 * Get a specific version of content
 */
export function getVersion<T>(
  versionedContent: VersionedContent<T>, 
  versionId: string
): T | null {
  return versionedContent.versions[versionId] || null;
}

/**
 * Revert to a specific version
 */
export function revertToVersion<T>(
  versionedContent: VersionedContent<T>, 
  versionId: string,
  author: string,
  comment: string = `Reverted to version ${versionId}`
): VersionedContent<T> {
  const targetVersion = getVersion(versionedContent, versionId);
  
  if (!targetVersion) {
    throw new Error(`Version ${versionId} not found`);
  }
  
  return addVersion(versionedContent, targetVersion, author, comment);
}

/**
 * Generate a version ID (timestamp-based with random suffix)
 */
function generateVersionId(): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${randomSuffix}`;
}

/**
 * Compare two versions of content (placeholder - actual implementation would depend on content type)
 */
export function compareVersions<T>(
  versionedContent: VersionedContent<T>,
  versionIdA: string,
  versionIdB: string
): { added: any[], removed: any[], changed: any[] } {
  // This is a placeholder implementation
  // Actual implementation would depend on the structure of T
  // and might use libraries like deep-diff or custom logic
  
  return {
    added: [],
    removed: [],
    changed: []
  };
}

/**
 * Get human-readable date/time from version timestamp
 */
export function formatVersionDate(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export default {
  createVersionedContent,
  addVersion,
  getVersion,
  revertToVersion,
  compareVersions,
  formatVersionDate
};
