// This file is for backward compatibility only.
// Import from content-registry.ts directly in new code.
import { contentModulesConfig, getModuleByPath, getReactComponent, getIframeSrc } from './content-registry.ts';

// Re-export ModuleConfig interface since it needs special handling in JS
// We define an empty object to satisfy the import in JS files
export const ModuleConfig = {};

export const contentModules = contentModulesConfig;
export { contentModulesConfig, getModuleByPath, getReactComponent, getIframeSrc };
