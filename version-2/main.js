'use strict';

// Electron
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const ipc = ipcMain;

// Required Modules
const path = require('path');
const url = require('url');

// Object Variables
let mainWindow;
let chartWindow;

// Display Object
let displayObj = {
    width: null,
    height: null
}

// App Icon Path
const appIconPath = (__dirname + '/assets/icons/app_icon.png');

// Function to create Main Window
function createWindow(){
    const display = screen.getPrimaryDisplay();
    const width = display.bounds.width;
    const height = display.bounds.height;

    displayObj = {
        width: width,
        height: height
    }

    console.log('Display :', display);

    mainWindow = new BrowserWindow({
        icon: appIconPath,

        width: 250,
        height: 250,

        x: (width-260),
        y: 10,

        show: false,

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

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', function(){
        mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    })
}

// Function to create Chart Window
function createChartWindow(){

    chartWindow = new BrowserWindow({
        // Window Icon
        icon: path.join(__dirname, '/assets/icons/app_icon.png'),

        // Window Resolution
        width: 250,
        height: 250,

        // Window Position
        x: (displayObj.width - 260),
        y: 255,

        show: false,

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
    chartWindow.loadURL(url.format({
        pathname: './components/chart-panel/chart-panel.html',
        protocol: 'file',
        slashes: true
    }))

    // Event : Window Loaded Fully
    chartWindow.on('ready-to-show',() => {
        chartWindow.show();
    });

    // Event : Window Closed
    chartWindow.on('closed',() => {
        chartWindow = null;
    });
}

// IPC Events
ipc.on('close-window', function(event){
    console.log('Close request recieved!');
    mainWindow = null;
    chartWindow = null;
    app.quit();
});

ipc.on('minimize-window', function(event){
    console.log('Minimize request recieved!');
    mainWindow.minimize();
});

ipc.on('expand-widget', (event) => {
    console.log('[Expanded Window Size]');
    mainWindow.setBounds({
        x: (displayWidth-410),
        y: 10,
        width: 400,
        height: 590
    });
});

ipc.on('default-widget', (event) => {
    console.log('[Default Window Size]');
    mainWindow.setBounds({
        x: (displayWidth-310),
        y: 10,
        width: 300,
        height: 385
    });
});

ipc.on('create-chart-panel-window',() => {
    createChartWindow();
    console.log('Creating Chart Window!');
});

// App Controls
app.on('ready', function(){
    createWindow();
    console.log('App Started!');
});

app.on('window-all-closed', function(){
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', function(){
    if(app === null){
        createWindow();
    }
});

