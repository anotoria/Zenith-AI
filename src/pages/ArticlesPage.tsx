import React from 'react';

export const ArticlesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Artigos</h1>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-muted-foreground">
          Lista de artigos será exibida aqui.
        </p>
      </div>
    </div>
  );
};
