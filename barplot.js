// 1st graph
// set graph1 inner width and height
const innerwidth_1 = graph_1_width - margin.left - margin.right;
const innerheight_1 = graph_1_height - margin.top - margin.bottom;


let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// static bar plot over all years and all platform
// get bar plot group
let barG = svg.append("g");

// Set up global x scale
let x = d3.scaleLinear()
    .range([0, innerwidth_1]);

// Set up global y Scale
let y = d3.scaleBand()
    .range([0, innerheight_1])
    .padding(0.2); //space between variables


// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g").attr('transform', `translate(-2, 0)`);

// Add x axis label
svg.append("text")
    .attr("transform", `translate(${(innerwidth_1) / 2},
                                  ${(innerheight_1) + 20})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Global Sales (Millions)");

// Add y-axis label
let y_axis_text = svg.append("text")
    .attr("transform", `translate(-100, ${(innerheight_1) / 2})`)      // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");


// Add chart title
let title = svg.append("text")
    .attr('class', 'title')
    .attr("transform", `translate(${(innerwidth_1) / 2}, -5)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle");

//
//function updateBar(start, end){
//    d3.csv("./data/video_games.csv").then(function(data) {
//            // Parse the data
//            // parse string into numbers(int/float)
//            data.forEach(d=> {d.Rank = parseInt(d.Rank);
//                              d.Year = parseInt(d.Year);
//                              d.NA_Sales = parseFloat(d.NA_Sales);
//                              d.EU_Sales = parseFloat(d.EU_Sales);
//                              d.JP_Sales = parseFloat(d.JP_Sales);
//                              d.Other_Sales = parseFloat(d.Other_Sales);
//                              d.Global_Sales = parseFloat(d.Global_Sales);
//                               });
//            // filter the data based on year and platform
//            let filter_data = data.filter(d => {return yearrange(start, end, d.Year);})
//                                .filter(d => {return chooseSelection(select_plat, d.Platform);})
function updateBar(start, end, select_plat){
            // filter the data based on year and platform
//            console.log(data);
            let filter_data = data.filter(d => {return yearrange(start, end, d.Year);})
                                .filter(d => {return chooseSelection(select_plat, d.Platform);})

            let comparator = function(a, b){ return b.Global_Sales - a.Global_Sales;}
            let Topdata = cleanData(filter_data, comparator, NUM_EXAMPLES);
//            console.log(Topdata);

            //define x and y value
            const xValue = function(d){return d.Global_Sales;}
            const yValue = function(d){return d.Name}

            //x scale
            x.domain([0,d3.max(Topdata, xValue)]);

            //y scale
            y.domain(Topdata.map(yValue));

            //y axis text
            y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(5));
            //set color
            let color = d3.scaleOrdinal()
                .domain(Topdata.map(yValue))
                .range(d3.quantize(d3.interpolateHcl("#FF8C00", "#FFD700"), NUM_EXAMPLES));

            // add bar plot
            let bars = svg.selectAll("rect").data(Topdata);
            bars.enter()
                .append("rect")
                .merge(bars)
                .attr("fill", d => color(yValue(d)))
                .style('opacity', 0.8)
                .transition()
                .duration(1000)
                .attr("x", x(0))
                .attr("y", d => y(yValue(d)))
                .attr("width", d => x(xValue(d)))
                .attr("height",  y.bandwidth());

            let sales = barG.selectAll("text").data(Topdata);

            // Edit label text
            sales.enter()
                .append("text")
                .merge(sales)
                .transition()
                .duration(1000)
                .attr('class', 'label_text')
                .attr("x", d => x(xValue(d))+10) //xscale offset
                .attr("y", d => y(yValue(d))+15) //yscale offset
                .style("text-anchor", "start")
                .text(xValue);

            // y_axis_text.text('Names');

            title.text('Top 10 Most Popular ' + platdisplay(select_plat) +' Games ' + yeardisplay(start, end));

            // Remove elements not in use if fewer groups in new dataset
            bars.exit().remove();
            sales.exit().remove();
    };
//}

