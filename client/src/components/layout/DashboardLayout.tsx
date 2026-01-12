import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Users,
  Clock,
  UserCog,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AISidebar from '@/components/dashboard/AISidebar';

const navItems = [
  { path: '/executive', label: 'Executive Overview', icon: LayoutDashboard },
  { path: '/skills', label: 'Skill vs Revenue', icon: Code2 },
  { path: '/designations', label: 'Designation vs Revenue', icon: Users },
  { path: '/time', label: 'Time Intelligence', icon: Clock },
  { path: '/ai-chat', label: 'AI Insights & Chat', icon: MessageSquareText },
  { path: '/', label: 'Back to Home', icon: UserCog },
];

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Navigation Sidebar */}
      <aside
        className={cn(
          'h-screen sticky top-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo - Brand Colors */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">X-DIVE</span>

            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 mx-auto mt-2 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-item',
                  isActive && 'active'
                )}
              >
                <Icon size={20} />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground">
              <p>November 2025 Data</p>
              <p className="mt-1">Last updated: Nov 30, 2025</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Filter Bar */}
    

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* AI Insights Sidebar */}
      <AISidebar isOpen={aiSidebarOpen} onToggle={() => setAiSidebarOpen(!aiSidebarOpen)} />
    </div>
  );
};

export default DashboardLayout;
