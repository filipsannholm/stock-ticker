import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Datapoint, Ticker } from '../../global';
import { generateRGBString } from '../../utils/dataHelpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export interface StockChartProps {
  stockData: {
    ticker: Ticker | undefined;
    data: Datapoint[];
    color: string | undefined;
  }[];
}

export default function StockChart({ stockData }: StockChartProps) {
  const labels = stockData[0].data.map((datapoint) => datapoint.date);

  const datasets = stockData.map((stock) => ({
    label: stock.ticker!.code,
    data: stock.data.map((datapoint) => datapoint.close),
    fill: false,
    borderColor: stock.color || generateRGBString(),
  }));

  return (
    <div>
      <Line options={options} data={{ labels, datasets }} />
    </div>
  );
}
