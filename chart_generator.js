'use strict';

// Chart.js Module
const Chart = require('chart.js');

function chart_generator(data,target){
    // Canvas DOM Object
    const ctxP = document.getElementById(target).getContext('2d');

    const active_cases = data.active_cases;
    const cured_cases = data.cured_cases;
    const total_deaths = data.total_deaths;

    const chart = new Chart(ctxP, {
      type: 'doughnut',
      data: {
        labels: ["Active Cases", "Total Recovered", "Total Deaths"],
        datasets: [{
          data: [active_cases, cured_cases, total_deaths],
          backgroundColor: ["#FDB45C", "#46BFBD","#F7464A"],
          hoverBackgroundColor: ["#FFC870", "#5AD3D1","#FF5A5E"],
          borderColor: "#FFFFFF",
          //borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        legend: {
            labels: {
                fontColor: 'white'
            }
        }
      }
    });

    return chart;
}

module.exports = chart_generator;