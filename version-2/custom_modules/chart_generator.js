'use strict';

// Chart.js Module
const Chart = require('chart.js');

function chart_generator(data,target){
    // Canvas DOM Object
    const ctxP = document.getElementById(target).getContext('2d');

    const active_cases = data.active_cases;
    const total_recovered = data.total_recovered;
    const total_deaths = data.total_deaths;

    const chart = new Chart(ctxP, {
      type: 'doughnut',
      data: {
        labels: ["Active Cases", "Total Recovered", "Total Deaths"],
        datasets: [{
          data: [active_cases, total_recovered, total_deaths],
          backgroundColor: ["#F0AD4E", "#5CB85C","#D9534F"],
          hoverBackgroundColor: ["#F0AD4E", "#5CB85C","#D9534F"],
          borderColor: "#FFFFFF",
          borderWidth: 1,
        }]
      },
      options: {
        layout: {
          padding: {
            top: 5,
            bottom: 5,
          }
        },
        responsive: true,
        legend: {
          display: false,
        }
      }
    });

    return chart;
}

module.exports = chart_generator;