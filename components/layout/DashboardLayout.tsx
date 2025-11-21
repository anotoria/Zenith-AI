import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { DashboardPage } from '@/pages/DashboardPage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { SocialPlannerPage } from '@/pages/SocialPlannerPage';

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/planner" element={<SocialPlannerPage />} />
              {/* More routes will be added */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
