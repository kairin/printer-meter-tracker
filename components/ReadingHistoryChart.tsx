
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MeterReading } from '../types';

interface ReadingHistoryChartProps {
  readings: MeterReading[];
}

const ReadingHistoryChart: React.FC<ReadingHistoryChartProps> = ({ readings }) => {
  if (!readings || readings.length === 0) {
    return <p className="text-mediumgray text-center py-4">No reading history available.</p>;
  }

  const chartData = readings
    .map(r => ({
      date: new Date(r.date).toLocaleDateString(),
      reading: r.reading,
      notes: r.notes
    }))
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-64 md:h-80 w-full mt-4">
       <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            formatter={(value, name, props) => [`${value}${props.payload.notes ? ` (${props.payload.notes})` : ''}`, "Reading"]}
          />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="reading" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 6 }} dot={{fill: '#2563eb', r:3}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadingHistoryChart;
