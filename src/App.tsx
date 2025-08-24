import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store, persistor } from '@/store/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { AddMember } from '@/pages/AddMember';
import { Members } from '@/pages/Members';
import { Plans } from '@/pages/Plans';
import { Settings } from '@/pages/Settings';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading component for PersistGate
const Loading: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-primary rounded-full animate-pulse-glow mx-auto mb-4"></div>
      <p className="text-foreground font-medium">Loading FitGym Pro...</p>
    </div>
  </div>
);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="dark min-h-screen bg-background">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/add-member" element={<AddMember />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
