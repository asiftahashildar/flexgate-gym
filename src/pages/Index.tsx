// This page is no longer used as the app has been restructured
// Main content is now handled by Dashboard.tsx through the routing system

import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
