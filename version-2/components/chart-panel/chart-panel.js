'use strict';

// Electron Modules
const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

// Custom Module
const { chart_generator, animations } = require('../../custom_modules/module_loader');

// DOM Objects
const body = document.querySelector('body');

let tracker_data = null;

// IPC Event : Tracker Data Recieveing
ipc.on('recieve-tracker-data',(event,data) => {
    tracker_data = Object.assign({},data);
    console.log('Tracker Data Recieved!');
});

let chart_loop = setInterval(() => {
    if(tracker_data != null){
        chart_generator(tracker_data,'chartCanvas');
        clearInterval(chart_loop);
    }
    else{
        // IPC Event : Tracker Data Request
        ipc.send('send-tracker-data',1);
        console.log('.');
    }
},1000);

// IPC Event : Window Slide Down
ipc.on('window-slide-down',() => {
    if(animations.slideDown(body)){
        console.log('[ SLIDE DOWN COMPLETE ]');
    }
});

// IPC Event : Window Slide Up
ipc.on('window-slide-up',() => {
    if(animations.slideUp(body)){
        console.log('[ SLIDE UP COMPLETE ]');
    }
});