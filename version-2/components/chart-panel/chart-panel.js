'use strict';

// Electron Modules
const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

// Custom Module
const { FileOPS ,chart_generator, animations } = require('../../custom_modules/module_loader');

// DOM Objects
const body = document.querySelector('body');

// File Operstions Object
const fops = new FileOPS('./data/tracker_data.json');
fops.loadData();

let chart_loop = setInterval(() => {
    if(fops.tracker_data != null){
        chart_generator(fops.tracker_data,'chartCanvas');
        clearInterval(chart_loop);
    }
    else{
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