import React from 'react';
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
    return (
      <iframe
        src={mod.entryPoint}
        title={mod.title}
        className="w-full h-full border-none"
      />
    );
  }

  // react-component
  const Component = mod.component!;
  return (
    <React.Suspense fallback={<div>Loading {mod.title}...</div>}>
      <Component />
    </React.Suspense>
  );
};

export default ContentRenderer;
