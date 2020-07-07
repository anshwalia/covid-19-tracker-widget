'use strict';

// Electron
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

// Required Modules
const path = require('path');
const url = require('url');

// Object Variables
let window;
let displayWidth;
let displayHeight;

const appIconPath = (__dirname + '/assets/icons/app_icon.png');

function createWindow(){
    const display = electron.screen.getPrimaryDisplay();
    const width = display.bounds.width;
    const height = display.bounds.height;

    displayWidth = width;
    displayHeight = height;

    window = new BrowserWindow({
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

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    window.on('closed', function(){
        window = null;
    });

    window.on('ready-to-show', () => {
        window.show();
    })
}

// IPC Events
ipc.on('close-window', function(event){
    console.log('Close request recieved!');
    app.quit();
});

ipc.on('minimize-window', function(event){
    console.log('Minimize request recieved!');
    window.minimize();
});

ipc.on('expand-widget', (event) => {
    console.log('[Expanded Window Size]');
    window.setBounds({
        x: (displayWidth-410),
        y: 10,
        width: 400,
        height: 590
    });
});

ipc.on('default-widget', (event) => {
    console.log('[Default Window Size]');
    window.setBounds({
        x: (displayWidth-310),
        y: 10,
        width: 300,
        height: 385
    });
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

