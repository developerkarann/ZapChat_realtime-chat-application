import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend } from 'chart.js'
import { orange, orangeLight, purple, purpleLight } from '../../constants/color'
import { getLast7Days } from '../../lib/features'

ChartJS.register(CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend)


const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
    title: { display: false },
    scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { display: false } }
    }
}

const LineChart = ({value=[]}) => {

    const data = {
        labels: getLast7Days(),
        datasets: [{
            data: value,
            label: 'Message',
            fill: true,
            backgroundColor: purpleLight,
            borderColor: purple,
        }]
    }
    return (
        <>
            <Line data={data} options={lineChartOptions} />
        </>
    )
}

const doughnutOptions = {
    responsive: true,
    plugins: {
        legend:{display: false},
        title: {display:false},
    },
    cutout: 100
}

const DoughnutChart = ({value=[], labels=[]}) => {
    const data = {
        labels,
        datasets: [{
            data: value,
            label: 'Total Chats VS Group Chat',
            fill: true,
            backgroundColor: [purpleLight, orangeLight],
            hoverBackgroundColor: [purple, orange],
            borderColor: [purple, orange],
            offset: 10
        }]
    }
    return (
        <>
            <Doughnut style={{zIndex: 10}} data={data} options={doughnutOptions}  />
        </>
    )
}

export { LineChart, DoughnutChart }