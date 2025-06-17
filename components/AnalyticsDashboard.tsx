
import React, { useMemo } from 'react';
import { Printer, PrinterType } from '../types';
import { calculatePeriodicCostsForPrinter, calculateTotalCostForPrinter, PeriodicCostDetail } from '../utils/costCalculations';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  printers: Printer[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ printers }) => {

  const monthlyCostData = useMemo(() => {
    const costsByMonth: { [monthYear: string]: number } = {};
    printers.forEach(printer => {
      const periodicCosts = calculatePeriodicCostsForPrinter(printer);
      periodicCosts.forEach(period => {
        const monthYear = new Date(period.periodEndDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
        costsByMonth[monthYear] = (costsByMonth[monthYear] || 0) + period.cost;
      });
    });
    return Object.entries(costsByMonth)
      .map(([name, cost]) => ({ name, cost }))
      .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime()); // Ensure chronological sort
  }, [printers]);

  const costDistributionData = useMemo(() => {
    return printers.map(printer => ({
      name: printer.name,
      totalCost: parseFloat(calculateTotalCostForPrinter(printer).toFixed(2)), // Ensure 2 decimal places
    })).sort((a,b) => b.totalCost - a.totalCost); // Sort by cost descending
  }, [printers]);

  const monthlyUsageData = useMemo(() => {
    const usageByMonth: { [monthYear: string]: { bwPages: number; fcPages: number } } = {};
    printers.forEach(printer => {
      const periodicCosts = calculatePeriodicCostsForPrinter(printer); // re-use for chargeable pages
      periodicCosts.forEach(period => {
        const monthYear = new Date(period.periodEndDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
        if (!usageByMonth[monthYear]) {
          usageByMonth[monthYear] = { bwPages: 0, fcPages: 0 };
        }
        if (printer.type === PrinterType.BLACK_AND_WHITE) {
          usageByMonth[monthYear].bwPages += period.chargeablePages;
        } else {
          usageByMonth[monthYear].fcPages += period.chargeablePages;
        }
      });
    });
     return Object.entries(usageByMonth)
      .map(([name, usage]) => ({ name, 'B&W Pages': usage.bwPages, 'FC Pages': usage.fcPages }))
      .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [printers]);
  
  const printersWithAge = useMemo(() => {
    return printers.map(p => {
        const installationDate = new Date(p.installationDate);
        const ageInMs = new Date().getTime() - installationDate.getTime();
        const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
        let ageGroup = ">2 years";
        if (ageInYears < 1) ageGroup = "<1 year";
        else if (ageInYears <= 2) ageGroup = "1-2 years";
        return { ...p, ageGroup, ageInYears };
    });
  }, [printers]);

  const usageCostByAgeData = useMemo(() => {
    const byAgeGroup: Record<string, { totalPages: number, totalCost: number, count: number }> = {};
    printersWithAge.forEach(p => {
        if (!byAgeGroup[p.ageGroup]) {
            byAgeGroup[p.ageGroup] = { totalPages: 0, totalCost: 0, count: 0 };
        }
        const periodicCosts = calculatePeriodicCostsForPrinter(p);
        const totalPagesForPrinter = periodicCosts.reduce((sum, item) => sum + item.chargeablePages, 0);
        const totalCostForPrinter = periodicCosts.reduce((sum, item) => sum + item.cost, 0);

        byAgeGroup[p.ageGroup].totalPages += totalPagesForPrinter;
        byAgeGroup[p.ageGroup].totalCost += totalCostForPrinter;
        byAgeGroup[p.ageGroup].count++;
    });

    return Object.entries(byAgeGroup).map(([ageGroup, data]) => ({
        name: ageGroup,
        'Avg Pages': data.count > 0 ? parseFloat((data.totalPages / data.count).toFixed(0)) : 0,
        'Avg Cost': data.count > 0 ? parseFloat((data.totalCost / data.count).toFixed(2)) : 0,
    })).sort((a,b) => a.name.localeCompare(b.name)); // Sort by age group
  }, [printersWithAge]);


  if (printers.length === 0) {
    return <div className="bg-white shadow-lg rounded-lg p-6 my-8 border border-gray-200 text-mediumgray text-center">No printer data available for analytics.</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-primary mb-6">Device Analytics Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <ChartCard title="Total Cost Over Time (Monthly)">
          {monthlyCostData.length > 0 ? (
            <LineChart data={monthlyCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`, "Cost"]}/>
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#8884d8" strokeWidth={2} name="Total Monthly Cost" />
            </LineChart>
          ) : <NoDataMessage />}
        </ChartCard>

        <ChartCard title="Cost Distribution by Printer">
           {costDistributionData.filter(d => d.totalCost > 0).length > 0 ? (
            <BarChart data={costDistributionData.filter(d => d.totalCost > 0).slice(0, 15)} layout="vertical" margin={{ left: 100 }}> {/* Show top 15 */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" width={150} tick={{fontSize: 10}} interval={0} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`, "Total Cost"]}/>
              <Legend />
              <Bar dataKey="totalCost" fill="#82ca9d" name="Total Cost Per Printer" />
            </BarChart>
          ) : <NoDataMessage message="No cost data to display for individual printers."/>}
        </ChartCard>

        <ChartCard title="Total Usage Over Time (Monthly)">
          {monthlyUsageData.length > 0 ? (
            <LineChart data={monthlyUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="B&W Pages" stroke="#374151" name="B&W Pages" />
              <Line type="monotone" dataKey="FC Pages" stroke="#ef4444" name="FC Pages" />
            </LineChart>
          ) : <NoDataMessage />}
        </ChartCard>

        <ChartCard title="Average Usage & Cost by Printer Age">
          {usageCostByAgeData.length > 0 ? (
             <BarChart data={usageCostByAgeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Avg Pages', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Avg Cost ($)', angle: 90, position: 'insideRight' }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Avg Pages" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="Avg Cost" fill="#82ca9d" />
            </BarChart>
          ) : <NoDataMessage />}
        </ChartCard>

      </div>
    </div>
  );
};

// ChartCard: A reusable wrapper for displaying charts.
// It provides a consistent title, styling, and a responsive container for any chart element passed as children.
const ChartCard: React.FC<{ title: string; children: React.ReactElement }> = ({ title, children }) => (
  <div className="p-4 border rounded-md shadow-sm bg-gray-50">
    <h3 className="text-lg font-semibold text-darkgray mb-4">{title}</h3>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

// NoDataMessage: A reusable component to display a message when there's no data for a chart or section.
const NoDataMessage: React.FC<{message?: string}> = ({message = "No data available for this chart."}) => (
  <div className="flex items-center justify-center h-full">
    <p className="text-mediumgray">{message}</p>
  </div>
);


export default AnalyticsDashboard;