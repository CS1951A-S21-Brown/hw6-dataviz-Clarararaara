// 3rd graph
// set graph3 inner width and height
const innerwidth_3 = graph_3_width - margin.left - margin.right;
const innerheight_3 = graph_3_height - margin.top - margin.bottom;


let svg_donut = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)     // HINT: width
    .attr("height", graph_3_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// get donut plot group
let donutG = svg_donut.append("g");

d3.csv("./data/video_games.csv").then(function(data) {
        // Parse the data
        // parse string into numbers(int/float)
        data.forEach(d=> {d.Rank = parseInt(d.Rank);
                          d.Year = parseInt(d.Year);
                          d.NA_Sales = parseFloat(d.NA_Sales);
                          d.EU_Sales = parseFloat(d.EU_Sales);
                          d.JP_Sales = parseFloat(d.JP_Sales);
                          d.Other_Sales = parseFloat(d.Other_Sales);
                          d.Global_Sales = parseFloat(d.Global_Sales);
                           });
        // filter the data based on year and platform
        let filter_data = data.filter(d => {return yearrange(start, end, d.Year);})
                            .filter(d => {return chooseSelection(select_plat, d.Platform);})
                            .filter(d => {return chooseSelection(select_genre, d.Genre);})

        let nestedData = d3.nest()
            .key(function(d) { return d.Publisher })
            .entries(filter_data);
        let sumSales = function (d) {
                let sum = 0.0;
                d.forEach(s => {return sum += s.Global_Sales;})
                return sum;
             };
        nestedData.forEach(d =>{ d.sales = sumSales(d.values)}) ;
        console.log(nestedData);
        });


//        let comparator1 = function(a, b){ return b.Global_Sales - a.Global_Sales;}
//        let topData= cleanData(filter_data, comparator1, 5);  // show top 5 publisher