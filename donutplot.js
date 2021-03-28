// 3rd graph
// set graph3 inner width and height
const innerwidth_3 = graph_3_width - margin.left - margin.right;
const innerheight_3 = graph_3_height - margin.top - margin.bottom;

const radius = Math.min(innerwidth_3, innerheight_3) /2;
//reference: https://www.d3-graph-gallery.com/graph/donut_label.html


function updateDonut(start, end, select_plat, select_genre){
            d3.select("#graph3").select("svg").remove();

            let svg_3 = d3.select("#graph3")
                .append("svg")
                .attr("width", graph_3_width)     // HINT: width
                .attr("height", graph_3_height)     // HINT: height
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
                        //donut group
            donutG = svg_3.append("g");

            //for donut plot
            const svg_donut = donutG.attr("transform", `translate(${innerwidth_3/2}, ${innerheight_3/2})`);

            let donutColorScale = d3.scaleOrdinal()
                      .range(d3.quantize(d3.interpolateHcl("#602437", "#ff9ebb"), 5))
            // Add chart title
            let donutTitle = donutG.append("text")
                .attr('class', 'title')
                .attr("transform", `translate(${0}, ${-innerheight_3/2})`)       // HINT: Place this at the top middle edge of the graph
                .style("text-anchor", "middle");

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
                        .innerRadius(radius/2.5)
                        .outerRadius(radius*0.8);
            const outerArc = d3.arc()
                        .innerRadius(radius*0.8 +8)
                        .outerRadius(radius*0.8 +8);

            let donutplot = svg_donut.selectAll('arc').data(pieData);
            donutplot
                .enter()
                .append('path')
                .merge(donutplot)
                .transition()
                .ease(d3.easeCircle)
                .duration(1000)
                .attr('d', arc)
                .attr('fill', d => donutColorScale(colorValue(d.data)))
                .attr('stroke', 'white') // add strokes between each section to make the division clear
                .attr('stroke-width', '4px');

            svg_donutLabel = svg_donut.selectAll('label').data(pieData);

            const labelLine = function (d){
                const start = arc.centroid(d); // line insertion in the pie
                const turning = outerArc.centroid(d); // the turning positon
                const end = outerArc.centroid(d); // position where label starts
                const angle = d.startAngle + (d.endAngle - d.startAngle) / 2
                end[0] = (radius*0.9) * (angle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [start, turning, end]
            };
            // add polylines
            svg_donutLabel
            .enter()
            .append('polyline') //append to a subgroup called polyline
            .merge(svg_donutLabel)
            .transition()
            .duration(1000)
                .attr('stroke', '#635F5D')
                .style('fill', 'none')
                .attr('stroke-width', '1.5px')
                .attr('points', labelLine) // adjust the length and position accordingly
;

            const textLabel = function (d){
                const labelPos = outerArc.centroid(d);
                const angle = d.startAngle + (d.endAngle - d.startAngle) / 2
                labelPos[0] = (radius*0.9) * (angle < Math.PI ? 1 : -1);
                return `translate(${labelPos})`
            }
            const labelDir = function(d){
                const angle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (angle < Math.PI ? 'start' : 'end')
            }
            // add label text
            svg_donutLabel
            .enter()
            .append('text')
            .merge(svg_donutLabel)
//            .transition()
//            .duration(1000)
            .attr('class', 'donut_label')
            .text(d => d.data.key )
            .attr('transform', textLabel)
            .style('text-anchor', labelDir)
            .style('font-weight', 'bold');

            svg_donutLabel
            .enter()
            .append('text')
            .merge(svg_donutLabel)
//            .transition()
//            .duration(1000)
            .attr('class', 'donut_label')
            .text(d => 'Total Global Sales: ' + d.data.sales +' M')
            .attr('transform', function (d){
                const labelPos = outerArc.centroid(d);
                const angle = d.startAngle + (d.endAngle - d.startAngle) / 2
                labelPos[0] = (radius*0.8) * (angle < Math.PI ? 1 : -1);
                return `translate(${labelPos})`
            })
            .attr('y', 16)
            .style('text-anchor', labelDir)
            .style('font-style', 'italic')
            .style('font-size', '12px');
            // edit Title
            donutTitle
            .text('Top 5 Publishers of ' + platdisplay(select_genre) +' Games ' + yeardisplay(start, end));


};

