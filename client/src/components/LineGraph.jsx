import React, { useState } from "react";
import LineChart from "./Line";
import { Data } from "../includes/dummyData";

function LineGraph({title, data }) {
  const [chartData, setChartData] = useState({
    labels: Object.keys(data),
    datasets: [
      {
        label: "Number of customers ",
        data: Object.values(data),
        backgroundColor: ["#3a72da"],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  return <LineChart title={title} chartData={chartData} />;
}

export default LineGraph;
