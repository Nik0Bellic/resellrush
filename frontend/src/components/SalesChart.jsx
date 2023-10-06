import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS } from 'chart.js';
import { registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useGetProductLastSalesQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import Message from './Message';

ChartJS.register(...registerables);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value, index, values) {
          return '$' + value;
        },
      },
    },
    x: {
      type: 'time',
      time: {
        tooltipFormat: 'DD T',
      },
    },
  },
};

const SalesChart = ({ productId }) => {
  const { selectedSize } = useSelector((state) => state.size);
  const {
    data: lastSales = [],
    isLoading,
    error,
  } = useGetProductLastSalesQuery(
    { productId, size: selectedSize },
    { skip: !selectedSize }
  );

  const chartData = {
    labels: lastSales.map((sale) => new Date(sale.createdAt)),
    datasets: [
      {
        fill: true,
        label: `Sales for Size ${selectedSize}`,
        data: lastSales.map((sale) => sale.price),
        borderColor: 'rgb(255, 199, 0)',
        backgroundColor: 'rgba(255, 199, 0, 0.4)',
      },
    ],
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='Error' text={error?.data?.message || error.error} />
  ) : (
    lastSales.length !== 0 && (
      <div className='mt-12 -mb-48'>
        <div className='text-xl font-medium w-full text-center'>
          Price History
        </div>
        <Line className='mt-6' options={options} data={chartData} />
      </div>
    )
  );
};

export default SalesChart;
