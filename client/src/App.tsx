import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ExecutiveOverview from "./pages/ExecutiveOverview";
import SkillRevenue from "./pages/SkillRevenue";
import DesignationRevenue from "./pages/DesignationRevenue";
import TimeIntelligence from "./pages/TimeIntelligence";
import ManagerPerformance from "./pages/LandingPage";
import AIInsightsChat from "./pages/AIInsightsChat";
import NotFound from "./pages/NotFound";
import IntroComponent from "./components/Intro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<IntroComponent />} />
            <Route path="/executive" element={<ExecutiveOverview />} />

            <Route path="/skills" element={<SkillRevenue />} />
            <Route path="/designations" element={<DesignationRevenue />} />
            <Route path="/time" element={<TimeIntelligence />} />
            <Route path="/managers" element={<ManagerPerformance />} />
            <Route path="/ai-chat" element={<AIInsightsChat />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
