import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../../styles/Charts.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
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
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
        },
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
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className={`chart-container ${animate ? 'chart-update-animation' : ''}`}>
      <Pie key={JSON.stringify(data)} options={options} data={data} />
    </div>
  );
};

export default PieChart; 