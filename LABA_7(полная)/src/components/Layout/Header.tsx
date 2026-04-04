import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="site-header bg-white/95 backdrop-blur sticky top-0 z-1000 shadow-md">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-indigo-600">
          <i className="fas fa-flask mr-2"></i>
          Лабораторная работа №7
        </h1>
        <p className="text-sm text-gray-600">React + TypeScript + SPA</p>
      </div>
    </header>
  );
};