import React, { Suspense, useEffect, useState } from 'react';
import { getModuleByPath, ContentModule } from './content-registry';
import { useParams, useNavigate } from 'react-router-dom';

const ContentRenderer: React.FC = () => {
  const { modulePath } = useParams<{ modulePath: string }>();
  const [module, setModule] = useState<ContentModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`[ContentRenderer] useEffect triggered with modulePath: '${modulePath}'`);
    if (!modulePath) {
      console.log("[ContentRenderer] No modulePath, attempting to navigate to default.");
      setError("No content module path specified in URL.");
      return;
    }

    const foundModule = getModuleByPath(modulePath);
    console.log(`[ContentRenderer] Searching for module with path: '${modulePath}'`);

    if (foundModule) {
      console.log(`[ContentRenderer] Found module:`, foundModule);
      setModule(foundModule);
      setError(null);
    } else {
      console.error(`[ContentRenderer] Content module not found for path: '${modulePath}'. Navigating to /404`);
      setError(`Content module not found: ${modulePath}.`);
    }
  }, [modulePath, navigate]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!module) {
    return <div className="p-4">Loading module information...</div>;
  }

  console.log(`[ContentRenderer] Rendering module '${module.title}' (type: ${module.type})`);

  if (module.type === 'iframe') {
    const iframeSrc = module.entryPoint.startsWith('/') ? module.entryPoint : `/${module.entryPoint}`;
    console.log(`[ContentRenderer] Rendering iframe with src: '${iframeSrc}' (original entryPoint: '${module.entryPoint}')`);
    return (
      <iframe
        src={iframeSrc}
        title={module.title}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    );
  }

  if (module.type === 'react-component' && module.component) {
    console.log(`[ContentRenderer] Rendering React component: '${module.title}'`);
    const Component = module.component;
    return (
      <Suspense fallback={<div className="p-4">Loading React component...</div>}>
        <Component />
      </Suspense>
    );
  }

  console.error(`[ContentRenderer] Unknown module type or missing component for module: '${module.title}'`);
  return <div className="p-4 text-red-500">Cannot render module: Unknown type or missing component.</div>;
};

export default ContentRenderer;
