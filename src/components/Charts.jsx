import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Area chart for earnings/revenue history
export const RevenueChart = ({ data = [], height = 300, color = "#16A34A" }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderRadius: '8px', 
              border: 'none', 
              color: '#F8FAFC' 
            }}
            formatter={(value) => [`₹${value}`, 'Revenue']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar chart for occupancy/booking volumes
export const OccupancyChart = ({ data = [], height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderRadius: '8px', 
              border: 'none', 
              color: '#F8FAFC' 
            }}
            formatter={(value) => [value, 'Bookings']}
          />
          <Bar dataKey="value" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Pie chart showing breakdown categories
export const CategoryChart = ({ data = [], height = 240 }) => {
  const COLORS = ['#16A34A', '#F59E0B', '#3B82F6', '#EF4444'];

  return (
    <div style={{ width: '100%', height }} className="flex flex-col items-center justify-center">
      <div className="w-full h-[180px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                borderRadius: '8px', 
                border: 'none', 
                color: '#F8FAFC' 
              }}
              formatter={(value, name, props) => [`${value}%`, props.payload.name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Dynamic Legend */}
      <div className="flex flex-wrap gap-4 mt-2 justify-center text-xs">
        {data.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-1.5 text-slate-600">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block" 
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span>{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
