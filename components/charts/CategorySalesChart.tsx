'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { MOCK_CATEGORY_SALES } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#ffffff', '#d4d4d8', '#a1a1aa', '#71717a'];

export function CategorySalesChart() {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_CATEGORY_SALES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            interval={0}
          />
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
            formatter={(value: any) => [formatCurrency(Number(value)), 'Sales Volume']}
          />
          <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
            {MOCK_CATEGORY_SALES.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
