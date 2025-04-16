import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/not-found";
import Dashboard from "./pages/dashboard";
import Centers from "./pages/centers";
import Districts from "./pages/districts";
import Lecturers from "./pages/lecturers";
import Students from "./pages/students";
import Assets from "./pages/assets";
import Courses from "./pages/courses";
import GISMapping from "./pages/gis-mapping";
import Reports from "./pages/reports";
import Login from "./pages/login";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";

function App() {
  // TEMPORARY: Hard code auth for development
  const [authenticated, setAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = { id: 1, username: "admin", name: "System Administrator", role: "admin" };
  
  // For development, log state
  useEffect(() => {
    console.log('Using development auth override');
  }, []);

  // Show login screen if explicitly not authenticated
  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user}
      />
      
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} flex flex-col transition-all duration-300`}>
        <Header user={user} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/centers" component={Centers} />
            <Route path="/districts" component={Districts} />
            <Route path="/lecturers" component={Lecturers} />
            <Route path="/students" component={Students} />
            <Route path="/assets" component={Assets} />
            <Route path="/courses" component={Courses} />
            <Route path="/gis-mapping" component={GISMapping} />
            <Route path="/reports" component={Reports} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
