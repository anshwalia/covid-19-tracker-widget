'use strict';

// Node Modules
const fs = require('fs');

// Class : File Operations
class FileOPS{

    // Class Constructor
    constructor(){
        this.filePath = './tracker_data.json';
        this.tracker_data = null;
    }

    // Method to load read and load json file as object
    loadData(){
        if(fs.existsSync(this.filePath)){
            let data = fs.readFileSync(this.filePath);
            this.tracker_data = JSON.parse(data);
            console.log('Data Load Success!');
        }
        else{
            console.log('File not found!');
        }
    }

    // Method to retrive data object
    getData(){
        if(this.tracker_data != null){
            return Object.assign({},this.tracker_data);
        }
        else{
            console.log('Data not found!');
        }
    }

    // Method to save data object as json file
    saveData(data){
        if(data != null){
            fs.writeFileSync(this.filePath, JSON.stringify(data,null,2));
            console.log('Data Save Success!');
        }
        else{
            console.log('Data is Null!')
        }
    }
}

// Exporting Class FileOPS
module.exports = FileOPS;