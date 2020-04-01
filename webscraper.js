'use strict';

const axios = require('axios');
const cheerio = require('cheerio');


class Webscraper{
    
    constructor(){
        this.url = 'https://www.mohfw.gov.in/';
        this.data = new Object();
        this.dataPercentage = new Object();
    }

    async fetchData(){
        
        await axios.get(this.url)
        .then((response) => {
            const html = response.data;
            
            const $ = cheerio.load(html);
            
            const d = $('.site-stats-count > ul > li > strong');

            let dataArray = [];
        
            for(let i = 0; i < 4; i++){
                //console.log(`${i} : `,d[i].children[0].data);
                dataArray.push(parseInt(d[i].children[0].data));
            }

            this.data = {
                total_cases: (dataArray[0] + dataArray[1] + dataArray[2]),
                active_cases: dataArray[0],
                cured_cases: dataArray[1],
                total_deaths: dataArray[2],
                migrated_cases: dataArray[3]
            }

            //console.log(this.data);

            }).catch((error) => { console.log(error); });
            
        console.log('Data Fetch Complete!');
        
    }

    getData(){
        return this.data;
    }

    dataToPercentage(){
        this.dataPercentage = {
            active_cases: ((this.data.active_cases/this.data.total_cases) * 100).toFixed(2),
            cured_cases: ((this.data.cured_cases/this.data.total_cases) * 100).toFixed(2),
            total_deaths: ((this.data.total_deaths/this.data.total_cases) * 100).toFixed(2),
            migrated_cases: ((this.data.migrated_cases/this.data.total_cases) * 100).toFixed(2)
        }
    }

    getPercentage(){
        return this.dataPercentage;
    }

}

// const d = new Webscraper();

// async function exec(){
//     await d.fetchData();
//     console.log(d.getData());
//     await d.dataToPercentage();
//     console.log(d.dataPercentage);
// }

// exec();

module.exports = Webscraper;