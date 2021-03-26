// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 60, right: 350, bottom: 60, left: 500};
const NUM_EXAMPLES = 10; //select top 10

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = MAX_WIDTH , graph_1_height = 400;
let graph_2_width = MAX_WIDTH , graph_2_height = 550;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

/*
let slider = new Slider('#yearrange', {})
// update start and end year on sliderStop
slider.on('sliderStop', function(range){
    start = range[0];
    end = range[1];
    updateGraph(start, end, )})
*/

// set constant

let start = 1981;
let end = 2017;
let select_plat = 'All'



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
    if(start === end){
        return (year === parseInt(start));
    }else{
        return (year >= parseInt(start) && parseInt(year) <= parseInt(end));
    }
}

// Filter platform based on selection
function choosePlatform(select_plat, platform){
    if(select_plat === 'All'){
        return (true);
    }else{
        return (platform === select_plat);
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

function updateGraph(start, end){
     dataupdate(start, end)
}
