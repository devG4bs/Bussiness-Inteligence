import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../../styles/Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface LineChartProps {
  data: any;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [animate, setAnimate] = useState(false);
  
  // Ativar a animação quando os dados mudarem
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [data]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 25, 40, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 10,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: '#00E396',
        fill: 'start',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(0, 227, 150, 0.5)');
          gradient.addColorStop(1, 'rgba(0, 227, 150, 0)');
          return gradient;
        },
      },
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: '#00E396',
        borderColor: '#111928',
        borderWidth: 2,
      },
    },
  };

  return (
    <div className={`chart-container ${animate ? 'chart-update-animation' : ''}`}>
      <Line key={JSON.stringify(data)} options={options} data={data} />
    </div>
  );
};

export default LineChart; 