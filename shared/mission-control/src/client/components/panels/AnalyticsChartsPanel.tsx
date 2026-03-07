import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CHART_COLORS = [
  '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7',
  '#06B6D4', '#F97316', '#EC4899', '#14B8A6', '#6366F1',
];

const TOOLTIP_STYLE = {
  backgroundColor: '#1F2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#E5E7EB',
};

export type ChartType = 'area' | 'bar' | 'line' | 'pie';

interface AnalyticsChartsPanelProps {
  title: string;
  chartType: ChartType;
  data: Array<Record<string, unknown>>;
  dataKeys: string[];
  nameKey?: string;
  height?: number;
  stacked?: boolean;
  gradientId?: string;
}

export const AnalyticsChartsPanel: React.FC<AnalyticsChartsPanelProps> = ({
  title,
  chartType,
  data,
  dataKeys,
  nameKey = 'name',
  height = 240,
  stacked = false,
  gradientId,
}) => {
  if (data.length === 0) {
    return (
      <div>
        <h3 className="text-xs font-semibold dark:text-gray-400 text-gray-600 uppercase tracking-wider mb-2">
          {title}
        </h3>
        <div className="card p-6 flex items-center justify-center" style={{ height }}>
          <p className="text-xs dark:text-gray-600 text-gray-400 italic">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-semibold dark:text-gray-400 text-gray-600 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="card p-4">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart(chartType, data, dataKeys, nameKey, stacked, gradientId)}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function renderChart(
  type: ChartType,
  data: Array<Record<string, unknown>>,
  dataKeys: string[],
  nameKey: string,
  stacked: boolean,
  gradientId?: string,
): React.ReactElement {
  switch (type) {
    case 'area':
      return (
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((key, i) => (
              <linearGradient key={key} id={`${gradientId || 'grad'}-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={nameKey} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {dataKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              fillOpacity={1}
              fill={`url(#${gradientId || 'grad'}-${key})`}
              strokeWidth={2}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </AreaChart>
      );

    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={nameKey} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {dataKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </BarChart>
      );

    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={nameKey} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {dataKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      );

    case 'pie':
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKeys[0]}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }: { name: string; percent: number }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: '#6B7280' }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      );
  }
}
