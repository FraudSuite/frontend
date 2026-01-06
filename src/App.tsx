import { useState } from 'react'
import { Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import PredictPage from "@/pages/PredictPage";
import ModelsPage from "@/pages/ModelsPage";
import { Home, Brain, Activity, BarChart3 } from 'lucide-react';




function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/models', icon: Brain, label: 'Models' },
    { path: '/predict', icon: Activity, label: 'Predict' },
  ];
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900">FraudGuard AI</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}






function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      <Routes>   
        <Route path="/" element={<HomePage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/models" element={<ModelsPage />} />
      </Routes>
    </div>
  )
}

export default App
