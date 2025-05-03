import React from "react";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

function LineChart({title, chartData }) {
  Chart.register(CategoryScale);
  return (
    <div className="chart-container" style={{ margin: "1em 0" }}>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
export default LineChart;
