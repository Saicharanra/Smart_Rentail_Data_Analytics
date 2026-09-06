'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MOCK_REVENUE_TREND } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export function RevenueTrendChart() {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MOCK_REVENUE_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="month" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <YAxis
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#09090b',
              borderColor: '#3f3f46',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(value: any) => [formatCurrency(Number(value)), '']}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Actual Revenue (₹)"
            stroke="#ffffff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRev)"
          />
          <Area
            type="monotone"
            dataKey="target"
            name="Azure BI Forecast (₹)"
            stroke="#a1a1aa"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorTarget)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
