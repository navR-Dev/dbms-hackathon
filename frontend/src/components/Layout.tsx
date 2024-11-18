import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Settings,
  DollarSign,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/portfolios", label: "Portfolios", icon: Briefcase },
  { path: "/transactions", label: "Transactions", icon: DollarSign },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/assets", label: "assets", icon: Settings },
];

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`font-bold text-xl text-emerald-600 ${!isSidebarOpen && "hidden"}`}
          >
            EcoVenture
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  location.pathname === item.path
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            className={`flex items-center text-gray-600 hover:text-gray-900 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <LogOut size={20} />
            <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
