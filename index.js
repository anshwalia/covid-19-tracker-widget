'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
//const fs = require('fs');
const $ = require('jquery');
const Chart = require('chart.js');

// Modules for web scraping
const axios = require('axios');
const cheerio = require('cheerio');

// Custom Webscraper Module
const Webscraper = require('./webscraper.js');

// Chart Generatot Module
const chart_generator = require('./chart_generator.js');

// Main Data Object
let wb;

// Chart Object
let chart;

// JQuery
$(document).ready(function(){
    // View States
    let infoView = false;
    let chartView = false;

    function displayWindow(data){
        console.log(data);
        chart = chart_generator(data,'pieChart');
        $('#loadWindow').fadeOut('fast',() => {
            ipc.send('default-widget');
        });
        $('#mainWindow').fadeIn('fast');
        // $('html').fadeIn('fast');
    }

    function loadData(data){
        $('#totalCases').text(data.total_cases);
        $('#activeCases').text(data.active_cases);
        $('#totalRecovered').text(data.cured_cases);
        $('#totalDeaths').text(data.total_deaths);
        $('#totalMigrated').text(data.migrated_cases);

        console.log('Data Load Complete!');
    }

    // View Toggle Function
    function toggleView(data,dataPercentage){
        if(infoView){
            loadData(data);
            $('#viewToggleBtn').text('Percentage View');
            infoView = false;
        }
        else{
            // Active Cases
            $('#activeCases').text(`${dataPercentage.active_cases} %`);

            // Total Recovered
            $('#totalRecovered').text(`${dataPercentage.cured_cases} %`);

            // Total Deaths
            $('#totalDeaths').text(`${dataPercentage.total_deaths} %`);

            // Total Migrated
            $('#totalMigrated').text(`${dataPercentage.migrated_cases} %`);

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

    // Entry Point
    async function start(){
        wb = new Webscraper();
        await wb.fetchData();
        await wb.dataToPercentage();
        await loadData(wb.getData());
        await displayWindow(wb.getData());
    }
    start();

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
    $('#viewToggleBtn').click(() => {
        toggleView(wb.getData(),wb.getPercentage());
    });

    // Chart Toggle Event Listener
    $('#chartToggleBtn').click(chartToggle);
});