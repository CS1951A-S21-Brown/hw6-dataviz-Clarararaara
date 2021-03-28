// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 2000;
const margin = {top: 60, right: 200, bottom: 60, left: 150};
const NUM_EXAMPLES = 10; //select top 10

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = MAX_WIDTH/2 +80, graph_1_height = 400;
let graph_2_width = MAX_WIDTH/2 + 150 , graph_2_height = 600;
let graph_3_width = MAX_WIDTH/2, graph_3_height = 500;

// set Default
let data;
let start = 1980;
let end = 2020;
let select_plat = 'All'
let select_genre = 'Action'

let yearslider = new Slider('#yearrange', {});

let platformDropdown = d3.select('#selectPlatform');

let genreDropdown = d3.select('#genreSelect');

d3.csv("./data/video_games.csv").then(function(dat) {
            // Parse the data
            // parse string into numbers(int/float)
            dat.forEach(d=> {d.Rank = parseInt(d.Rank);
                              d.Year = parseInt(d.Year);
                              d.NA_Sales = parseFloat(d.NA_Sales);
                              d.EU_Sales = parseFloat(d.EU_Sales);
                              d.JP_Sales = parseFloat(d.JP_Sales);
                              d.Other_Sales = parseFloat(d.Other_Sales);
                              d.Global_Sales = parseFloat(d.Global_Sales);
                               });
            data = dat;
//            console.log(data);
            updateDashboard();

            });

//let data1 = loadData()
//
//console.log(data1)

//// update start and end year on sliderStop
yearslider.on('slideStop', function(range){
    start = range[0];
    end = range[1];
//    console.log(range);
    updateDashboard()});

// update selection from both dropdowns for platform and game genre
platformDropdown.on('change',function (selection){
            select_plat = this.value;
            updateDashboard();
});

genreDropdown.on('change',function (selection){
            select_genre = this.value;
            updateDashboard();
});







/*
Used Functions
*/

// Clean and select top 10
function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    return data.sort(comparator).slice(0, numExamples);
}

// Filter data based on start and end year
function yearrange(start, end, year){
    if(start !== end){
        return (year >= parseInt(start)) && (year <= parseInt(end));
    }else{
        return year === parseInt(start);
    }
}

// Filter platform or genre based on selection
function chooseSelection(select, origin){
    if(select === 'All'){
        return (true);
    }else{
        return (origin === select);
    }
}


// display selected year as (start_year-end_year) or as (year)
function yeardisplay(start, end){
    if(start === end){
        return ('('+ start +')');
    }else{
        return ('('+ start + '-' + end +')');
    }
}
// display the selected platform as platform name or as Video if select All
function platdisplay(select_plat){
    if(select_plat === 'All'){
        return ('Video');
    }else{
        return (select_plat);
    }
}



function updateDashboard(){
       updateBar(start, end, select_plat);
       updateMap(start, end,  select_plat); //Map and bar will change based on year and platform
       updateDonut(start, end, select_plat, select_genre);
}
