'use strict';

// Electron Modules
const electron = require('electron');
const ipc = electron.ipcRenderer;

// JQuery
const $ = require('jquery');

// Chart.js
const Chart = require('chart.js');

// Modules for web scraping
const axios = require('axios');
const cheerio = require('cheerio');

// Indian Govt. Website URL
const url = 'https://www.mohfw.gov.in/';

// Main Data Object
const data = {};

// Converting String Data Array to Number Array
function dataCleaner(){
    let dataset = [];

    for(let i = 0; i < data.rawData.length; i++){
        let e = '';
        for(let j = 0; j < data.rawData[i].length; j++){
            if(data.rawData[i][j] != ','){
                e += data.rawData[i][j];
            }
        }
        dataset[i] = parseInt(e);
    }

    data.dataset = dataset;
}

// Data to Percentage Conversion
function dataToPercentage(){
    let percentage = [];

    let totalCases = data.dataset[1];

    for(let i = 1; i < data.dataset.length; i++){
        percentage.push(parseFloat(((data.dataset[i]/totalCases)*100).toFixed(2)));
    }

    console.log(percentage);
    data.percentage = percentage;
}

// Fetching data from govt site
function fetchData(){
    let rawData = [];

    axios.get(url)
    .then((response) => {

        const html = response.data;

        const $ = cheerio.load(html);

        const dataObjects = $('.icount');

        for(let i = 0; i < dataObjects.length; i++){
            if(dataObjects[`${i}`].children[0].type === 'text'){
                rawData.push(dataObjects[`${i}`].children[0].data);
            }
        }

        console.log(rawData);
    })
    .catch((error) => {
        console.log(error);
    });

    data.rawData = rawData;
    
    console.log('Data Fetch Complete!');
}

function genratePieChart(){
    // Canvas DOM Object
    const ctxP = document.getElementById("pieChart").getContext('2d');

    const totalCases = data.dataset[1];
    const totalRecovered = data.dataset[2];
    const totalDeaths = data.dataset[3];

    const myPieChart = new Chart(ctxP, {
      type: 'doughnut',
      data: {
        labels: ["Total Cases", "Total Recovered", "Total Deaths"],
        datasets: [{
          data: [totalCases, totalRecovered, totalDeaths],
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
}

// JQuery Code
$(document).ready(function(){
    // View States
    let infoView = false;
    let chartView = false;

    const loader = setInterval(() => {
        if(data.rawData.length){
            loadData();
            displayWindow();
            clearInterval(loader);
        }
    },1000);

    function displayWindow(){
        dataCleaner();
        console.log(data.dataset);
        dataToPercentage();
        genratePieChart();
        $('#loadWindow').fadeOut('fast',() => {
            ipc.send('default-widget');
        });
        $('#mainWindow').fadeIn('fast');
        // $('html').fadeIn('fast');
    }

    function loadData(){
        $('#totalTested').text(data.rawData[0]);
        $('#totalCases').text(data.rawData[1]);
        $('#totalRecovered').text(data.rawData[2]);
        $('#totalDeaths').text(data.rawData[3]);
        $('#totalMigrated').text(data.rawData[4]);

        console.log('Data Load Complete!');
    }

    // View Toggle Function
    function toggleView(){
        if(infoView){
            loadData();
            $('#viewToggleBtn').text('Percentage View');
            infoView = false;
        }
        else{
            // Total Cases
            $('#totalCases').text(`${data.rawData[1]} (${data.percentage[0]}%)`);

            // Total Recovered
            $('#totalRecovered').text(`${data.percentage[1]} %`);

            // Total Deaths
            $('#totalDeaths').text(`${data.percentage[2]} %`);

            // Total Migrated
            $('#totalMigrated').text(`${data.percentage[3]} %`);

            $('#viewToggleBtn').text('Detailed View');

            infoView = true;
        }
    }

    // Chart Toggle Function
    function chartToggle(){
        if(chartView){
            $('html').fadeOut('fast', () => {
                $('#chartSection').hide();
                $('#chartToggleBtn').text('Show Chart');
                ipc.send('default-widget');
            }).fadeIn('fast');
            chartView = false;
        }
        else{
            $('html').fadeOut('fast', () => {
                ipc.send('expand-widget');
            }).fadeIn('fast');
            $('#chartSection').fadeIn('fast');
            $('#chartToggleBtn').text('Hide Chart');
            chartView = true;
        }
    }

    fetchData();

    // Exit Button Event Listener
    $('#exitBtn').click(() => {
        console.log('Closing the window!');
        $('html').fadeOut('fast');
        setTimeout(() => {ipc.send('close-window')}, 500);
    });

    // Minimize Button Event Listener
    $('#minimizeBtn').click(() => {
        console.log('Minimizing the Window!');
        ipc.send('minimize-window');
    });

    // View Toggle Event Listener
    $('#viewToggleBtn').click(toggleView);

    // Chart Toggle Event Listener
    $('#chartToggleBtn').click(chartToggle);
});