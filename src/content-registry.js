// This file is for backward compatibility only.
// Import from content-registry.ts directly in new code.
import { contentModulesConfig, getModuleByPath, getReactComponent, getIframeSrc, ModuleConfig } from './content-registry.ts';

export const contentModules = contentModulesConfig;
export { contentModulesConfig, getModuleByPath, getReactComponent, getIframeSrc, ModuleConfig };
