import React, { Suspense } from 'react';
import { ContentModule, getModuleByPath } from './content-registry';
import { useParams } from 'react-router-dom';

const ContentRenderer: React.FC = () => {
  const { modulePath } = useParams<{ modulePath: string }>();
  const mod: ContentModule | undefined = modulePath
    ? getModuleByPath(modulePath)
    : undefined;

  if (!mod) {
    return <div className="p-4">Module not found.</div>;
  }

  if (mod.type === 'iframe') {
    // Ensure the path is correctly formed, especially for local HTML files
    // If entryPoint is relative to public, it should work directly.
    // If it needs the base URL, ensure it's constructed properly.
    const iframeSrc = mod.entryPoint.startsWith('http')
      ? mod.entryPoint
      : `${import.meta.env.BASE_URL}${mod.entryPoint}`.replace(/\/\//g, '/');

    return (
      <iframe
        src={iframeSrc}
        title={mod.title}
        className="w-full h-screen border-0" // Adjust height as needed
      />
    );
  }

  if (mod.type === 'react-component' && mod.component) {
    const Component = mod.component;
    return (
      <Suspense fallback={<div className="p-4">Loading module...</div>}>
        <Component />
      </Suspense>
    );
  }

  return <div className="p-4">Module type not supported or component not found for "{mod.title}".</div>;
};

export default ContentRenderer;
