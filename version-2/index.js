'use strict';

// ElectronJS
const { ipcRenderer : ipc } = require('electron');

// AngularJS
const angular = require('angular');

// Custom Modules
const { Webscraper, FileOPS } = require('./custom_modules/module_loader');

// Global Variables
let td = null;

// JavaScript
ipc.send('send-tracker-data',0);

// Data from Main Process Loop
let td_loop = setInterval(() => {
    if(td != null){
        console.log('Data Recieved From Main Process!');
        clearInterval(td_loop);
    }
    else{
        ipc.send('send-tracker-data',0);
    }
},1000);

// IPC Event : Receiving Tracker Data
ipc.on('recieve-tracker-data',(event,data) => {
    td = Object.assign({},data);
    console.log('Tracker Data :',td);
});

// Angular Module
const app = angular.module('App',[]);

// Angular Controller
app.controller('App-Ctrl',($scope) => {

    // Module Data Objects
    $scope.tracker_data = {
        total_cases: 0,
        active_cases: 0,
        total_recovered: 0,
        total_deaths: 0
    };

    // Data Laod Loop
    $scope.data_load_loop = setInterval(() => {
        if(td != null){
            $scope.$apply(() => {
                $scope.tracker_data = {
                    total_cases: td.total_cases,
                    active_cases: td.active_cases,
                    total_recovered: td.total_recovered,
                    total_deaths: td.total_deaths
                }
                console.log('Tracker Data Retrived!');
            });
            clearInterval($scope.data_load_loop);
        }
        else{
            console.log('.')
        }
    },1000);

    // Function to Close App
    $scope.closeApp = () => {
        ipc.send('close-window');
    }

    // Function to toggle chart window
    $scope.toggleChartWindow = () => {
        ipc.send('toggle-chart-window');
    }

});