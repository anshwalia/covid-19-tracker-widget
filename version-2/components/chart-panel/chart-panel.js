'use strict';

// Custom Module
const { FileOPS ,chart_generator } = require('../../custom_modules/module_loader');

// File Operstions Object
const fops = new FileOPS('./data/tracker_data.json');
fops.loadData();

let chart_loop = setInterval(() => {
    if(fops.tracker_data != null){
        chart_generator(fops.tracker_data,'#cv');
        clearInterval(chart_loop);
    }
    else{
        console.log('.');
    }
},1000);