import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const GenderDoughnutChart = ({ chartType, labels, dataValues, backgroundColor, label }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: dataValues,
                backgroundColor: backgroundColor,
                hoverOffset: 4,
            },
        ],
    };

    useEffect(() => {
        return () => {
            if (ChartJS.getChart(data.id)) {
                ChartJS.getChart(data.id).destroy();
            }
        };
    }, [data.id]);

    const renderChart = () => {
        switch (chartType) {
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'line':
                return <Line data={data} options={options} />;
            default:
                return <p>No valid chart type selected</p>;
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div >
            {renderChart()}
            <h2>{label}</h2>
        </div>
    );
};

export default GenderDoughnutChart;
