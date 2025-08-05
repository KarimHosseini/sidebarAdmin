import { Paper } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  defaults,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

defaults.font.family = "IRANSansfa";
const Charts = ({ labels, notifications }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "  گزارش فروش",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: " تعداد سفارش ها",
        data: notifications.map((i, index) => i.qty),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        FontFace: "IRANSansfa",
      },
    ],
  };

  return (
    <Paper
      sx={{ border: "1px solid #dbdfea", mb: 1, padding:"15px 16px" }}
      elevation={0}
    >
      <Bar options={options} data={data} />
    </Paper>
  );
};

export default Charts;
