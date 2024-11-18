import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, DollarSign, PieChart } from 'lucide-react';

function Dashboard() {
  const { data: portfolioStats } = useQuery({
    queryKey: ['portfolioStats'],
    queryFn: async () => {
      const response = await fetch('/api/portfolio/stats');
      return response.json();
    },
  });

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: '$2,456,789',
      change: '+12.3%',
      icon: DollarSign,
    },
    {
      title: 'Active Investments',
      value: '34',
      change: '+2',
      icon: PieChart,
    },
    {
      title: 'Monthly Return',
      value: '+8.4%',
      change: '+2.1%',
      icon: TrendingUp,
    },
    {
      title: 'YTD Performance',
      value: '+23.6%',
      change: '+5.2%',
      icon: BarChart3,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Portfolio Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {/* Placeholder for transactions list */}
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h2>
          <div className="h-64 flex items-center justify-center">
            {/* Placeholder for chart */}
            <p className="text-gray-500">Loading chart...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;