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

// Appliction States
const app_states = {
    chartView: false,
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
    });
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
    }));

    // Event : Window Closed
    chartWindow.on('closed',() => {
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
    if(showWindow(chartWindow)){
        chartWindow.webContents.send('window-slide-down');
        app_states.chartView = true;
        console.log('[ Chart Window Visible ]');
    }
}

// Function hide chart window
function hideChartWindow(){
    chartWindow.webContents.send('window-slide-up');
    setTimeout(() => {
        if(hideWindow(chartWindow)){
            console.log('[ Chart Window Hidden ]');
            app_states.chartView = false;
        }
    },1000);
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

// IPC Event : Create Chart Window
ipc.on('create-chart-window',() => {
    createChartWindow();
    console.log('Creating Chart Window!');
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

