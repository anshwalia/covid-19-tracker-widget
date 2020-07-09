'use strict';

// ElectronJS
const electron = require('electron');
const ipc = electron.ipcRenderer;

// AngularJS
const angular = require('angular');

// Custom Modules
const { Webscraper, FileOPS } = require('./custom_modules/module_loader');

// Angular Module
const app = angular.module('App',[]);

// Angular Controller
app.controller('App-Ctrl',($scope) => {

    // Scope Variables
    $scope.fops = new FileOPS(null);

    // Tracker Data Object
    $scope.tracker_data = {
        total_cases: 0,
        active_cases: 0,
        total_recovered: 0,
        total_deaths: 0
    }

    // Function to fetch data from internet
    $scope.fetchTrackerData = () => {
        // Fetching Data from Govt. Website
        const webscp = new Webscraper();
        webscp.fetchData();

        // Fetch Loop
        let fetch_loop = setInterval(() => {
            if(webscp.data){
                // Data Copy and Refresh
                $scope.$apply(() => {
                    $scope.tracker_data = {
                        total_cases: webscp.data.total_cases,
                        active_cases: webscp.data.active_cases,
                        total_recovered: webscp.data.recovered_cases,
                        total_deaths: webscp.data.total_deaths
                    }
                });
                console.log($scope.tracker_data);

                // Saving Data to file
                $scope.fops.saveData($scope.tracker_data);

                // Creating Chart Panel Window
                ipc.send('create-chart-panel-window');

                clearInterval(fetch_loop);
            }
            else{
                console.log('.');
            }
        },1000);
    }

    // Function to Close App
    $scope.closeApp = () => {
        ipc.send('close-window');
    }

    // Start Point
    $scope.fetchTrackerData();

});