// 3rd graph
// set graph3 inner width and height
const innerwidth_3 = graph_3_width - margin.left - margin.right;
const innerheight_3 = graph_3_height - margin.top - margin.bottom;

const radius = Math.min(graph_3_width, graph_3_height) /2;

let svg_donut = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)     // HINT: width
    .attr("height", graph_3_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
//donut group
donutG = svg_donut.append("g");



let donutColorScale = d3.scaleOrdinal()
          .range(d3.quantize(d3.interpolateHcl("#602437", "#ff9ebb"), 5))
// Add chart title
let donutTitle = svg_donut.append("text")
    .attr('class', 'title')
    .attr("transform", `translate(${(innerwidth_1) / 2}, -5)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle");


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
            let filter_data = data.filter(d => {return yearrange(start, end, d.Year);}) //choose year range
                                .filter(d => {return chooseSelection(select_plat, d.Platform);}) // choose platform
                                .filter(d => {return chooseSelection(select_genre, d.Genre);}) // choose genre

            let nestedData = d3.nest()
                .key(function(d) { return d.Publisher })
                .entries(filter_data); // nest data by publisher
            // function for calculate sum of global sales
            let sumSales = function (d) {
                    let sum = 0.0;
                    d.forEach(s => {return sum += s.Global_Sales;})
                    return sum.toFixed(3);
                 };
            nestedData.forEach(d =>{ d.sales = parseFloat(sumSales(d.values))}) ; // return data set with key, values and sales(sum of global sales)
    //        console.log(nestedData);
            let Toppublisher = cleanData(nestedData, function(a, b){ return b.sales- a.sales;}, 5); // I only want to display 5 top publishers per genre based on sales
    //        console.log(Toppublisher);
    //        let publishers = {}; // create a new dataset with only publishers and sales
    //        Toppublisher.forEach(function(d){publishers[d.key] = d.sales});
    //        console.log(publishers);
            const colorValue = function(d){return d.key}
            donutColorScale.domain(Toppublisher.map(colorValue)); //domain is the 5 publisher
    //        console.log(donutColorScale.domain())

            let pie = d3.pie()
                    .value(function(d){return d.sales;});
            let pieData = pie(Toppublisher);
    //        console.log(pieData);
            const arc = d3.arc()
                        .innerRadius(radius/Math.PI)
                        .outerRadius(radius * (2/3));

            svg_donut
            .selectAll('arc')
            .data(pieData)
            .enter()
            .append('path')
            .attr("transform", `translate(${margin.left}, ${margin.top*2 +50})`)
            .attr('d', arc)
            .attr('fill', d => donutColorScale(colorValue(d.data)))
            .attr('stroke', 'white') // add strokes between each section to make the division clear
            .attr('stroke-width', '4px')
            .style("opacity", 0.9)
            .transition()
            .duration(1000);

            let publisherLabel = donutG.selectAll("text").data(Toppublisher);


            // edit Title
            donutTitle
            .text('Top 5 Publishers of ' + platdisplay(select_genre) +' Games ' + yeardisplay(start, end));

            });


