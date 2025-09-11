import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

export default function AdminHome() {
  const stats = [
    {
      title: 'Job Postings',
      value: 120,
      borderColor: 'border-blue-500',
      chartData: [
        { title: 'Active', value: 80, color: '#3b82f6' },
        { title: 'Closed', value: 40, color: '#60a5fa' },
      ],
    },
    {
      title: 'Student Queries',
      value: 45,
      borderColor: 'border-green-500',
      chartData: [
        { title: 'Resolved', value: 30, color: '#10b981' },
        { title: 'Pending', value: 15, color: '#34d399' },
      ],
    },
    {
      title: 'Notifications',
      value: 25,
      borderColor: 'border-yellow-500',
      chartData: [
        { title: 'Sent', value: 20, color: '#f59e0b' },
        { title: 'Draft', value: 5, color: '#fbbf24' },
      ],
    },
    {
      title: 'Applications',
      value: 300,
      borderColor: 'border-purple-500',
      chartData: [
        { title: 'Accepted', value: 200, color: '#8b5cf6' },
        { title: 'Rejected', value: 100, color: '#a78bfa' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-white p-4 rounded-lg shadow-lg border-3 hover:shadow-xl transition-all duration-300 ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className="w-16 h-16">
                <PieChart
                  data={stat.chartData}
                  lineWidth={20}
                  radius={40}
                  label={({ dataEntry }) => `${dataEntry.value}`}
                  labelStyle={{ fontSize: '0px', fill: '#000' }}
                />
              </div>
            </div>
            <div className="mt-4 border-t pt-2 text-sm text-gray-600 flex justify-between items-center">
              
              <a href="#" className="text-blue-500 hover:underline">View More</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
