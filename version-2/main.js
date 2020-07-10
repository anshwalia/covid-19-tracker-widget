'use strict';

// Electron
const { app, BrowserWindow, ipcMain : ipc, screen } = require('electron');

// Node Modules
const path = require('path');
const url = require('url');

// Custom Modules
const { Webscraper, FileOPS } = require('./custom_modules/module_loader');

// Object Variables
let tracker_data = {
    total_cases: 0,
    active_cases: 0,
    total_recovered: 0,
    total_deaths: 0
}

// File Operstions Object
const fops = new FileOPS('./data/tracker_data.json');

// Webscraper Object
const webscp = new Webscraper();
console.log('[ Fetching Tracker Data ]');
webscp.fetchData();

// Fetch Loop
let fetch_loop = setInterval(() => {
    if(webscp.data != null){
        // Upadting Tracker Data Object
        tracker_data = {
            total_cases: webscp.data.total_cases,
            active_cases: webscp.data.active_cases,
            total_recovered: webscp.data.total_recovered,
            total_deaths: webscp.data.total_deaths
        }
        app_states.tracker_data_fetched = true;
        console.log('[ Tracker Data Fetched ]');

        // Saving Tracker Data
        fops.saveData(tracker_data);

        clearInterval(fetch_loop);
    }
    else{
        console.log('.');
    }
},1000);

// Windows Object
const windows = {
    main: null,
    chart: null
}

// Display Object
let displayObj = {
    width: null,
    height: null
}

// Appliction States
const app_states = {
    tracker_data_fetched: false,
    chartView: false,
}

// App Icon Path
const appIconPath = (__dirname + '/assets/icons/app_icon.png');

// Function to create Main Window
function createMainWindow(){
    const display = screen.getPrimaryDisplay();
    const width = display.bounds.width;
    const height = display.bounds.height;

    displayObj = {
        width: width,
        height: height
    }

    console.log('Display :', displayObj);

    windows.main = new BrowserWindow({
        // Window Icon
        icon: appIconPath,

        // Window Resolution
        width: 250,
        height: 250,

        // Window Position
        x: (width-260),
        y: 10,

        // Window Visibility
        show: false,

        // Window Options
        frame: false,
        transparent: true,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        
        webPreferences: {
            nodeIntegration: true
        }
    });

    windows.main.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    windows.main.on('closed', function(){
        mainWindow = null;
    });

    windows.main.on('ready-to-show', () => {
        windows.main.show();
    });
}

// Function to create Chart Window
function createChartWindow(){

    windows.chart = new BrowserWindow({
        // Window Icon
        icon: appIconPath,

        // Window Resolution
        width: 250,
        height: 250,

        // Window Position
        x: (displayObj.width - 260),
        y: 255,

        // Window Visiblilty
        show: false,

        // Window Options
        frame: false,
        transparent: true,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        
        webPreferences: {
            nodeIntegration: true
        }

    });

    // Loading HTML File 
    windows.chart.loadURL(url.format({
        pathname: './components/chart-panel/chart-panel.html',
        protocol: 'file',
        slashes: true
    }));

    // Event : Window Closed
    windows.chart.on('closed',() => {
        chartWindow = null;
    });
}

// Function to show window seamlessly
function showWindow(window){
    window.setOpacity(0)
    window.show()
    setTimeout(() => {
        window.setOpacity(1);
    }, 1000/60);
    return true;
}

// Function to hidw window seamlessly
function hideWindow(window){
    setTimeout(() => {
        window.setOpacity(0);
        window.hide();
    },1000/60);
    return true;
}

// Function to show chart window
function showChartWindow(){
    if(showWindow(windows.chart)){
        windows.chart.webContents.send('window-slide-down');
        app_states.chartView = true;
        console.log('[ Chart Window Visible ]');
    }
}

// Function hide chart window
function hideChartWindow(){
    windows.chart.webContents.send('window-slide-up');
    setTimeout(() => {
        if(hideWindow(windows.chart)){
            console.log('[ Chart Window Hidden ]');
            app_states.chartView = false;
        }
    },1000);
}

// Function to identify window
function findWindow(windowID){
    switch(windowID){
        case 0:
            console.log(windowID,':','Main Window');
            return windows.main;
        break;
        case 1:
            console.log(windowID,':','Chart Window');
            return windows.chart;
        break;
        default:
            console.log(windowID,':','Main Window');
            return windows.main;
    }
}

// IPC Events

// IPC Event : Tracker Data Requested
ipc.on('send-tracker-data',(event,windowID) => {
    console.log('WindowID :',windowID);
    let window = findWindow(windowID);

    if(app_states.tracker_data_fetched){
        window.webContents.send('recieve-tracker-data',Object.assign({},tracker_data));
        console.log('Sending Tarcker Data!');
    }
    else{
        console.log('Tracker Data Not Fetched!');
    }
});

// IPC Event : Close App
ipc.on('close-window',(event) => {
    console.log('Close request recieved!');
    windows.main = null;
    windows.chart = null;
    app.quit();
});

// IPC Event : Minimize App
ipc.on('minimize-window',(event) => {
    console.log('Minimize request recieved!');
    windows.main.minimize();
});

// IPC Event : Toggle Chart Window
ipc.on('toggle-chart-window',() => {
    if(app_states.chartView){
        console.log('[ Hiding Chart Window ]');
        hideChartWindow();
    }
    else{
        console.log('[ Showing Chart Window ]');
        showChartWindow();
    }
});

// APP EVENTS

// App Ready
app.on('ready', function(){
    createMainWindow();
    createChartWindow();
    console.log('App Started!');
});

// App Windows All Closed : App Close
app.on('window-all-closed', function(){
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

// App Window Activation
app.on('activate', function(){
    if(app === null){
        createMainWindow();
        createChartWindow();
    }
});

