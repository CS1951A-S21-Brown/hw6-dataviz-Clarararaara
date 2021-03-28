
// 2nd graph
// set graph2 inner width and height
const innerwidth_2 = graph_2_width - margin.left - margin.right;
const innerheight_2 = graph_2_height - margin.top - margin.bottom;
let regionSelect = 'Europe'

let svgG = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height);     // HINT: height

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection)
//projection reference: https://github.com/d3/d3-geo

const svg_map = svgG.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`) //set a mapgroup with the given position
const svg_main = svgG.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

//add in zoom effect
svgG.call(d3.zoom().on('zoom', () => {
    svg_map.attr('transform', d3.event.transform)
  })); // cannot figure out why the map switches place when using a smaller screen

//Add sphere as the Earth background
svg_map.append('path')
       .attr('class', 'sphere')
       .attr('d', pathGenerator({type:'Sphere'}));



 // set the legend group with the position
const legendG = svg_main.append('g')
    .attr('transform', `translate(${-margin.left/4}, ${innerheight_2-margin.bottom})`)

let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
        .attr("opacity", 0)
;

// set color scale
let colorScale = d3.scaleOrdinal().range(['#6a994e', '#6a4c93', '#e76f51', '#d81159']);

/* json resource: https://www.npmjs.com/package/world-atlas
    map coding reference from https://www.vizhub.com
*/

function updateMap(start_year, end_year, plat){
    Promise.all([
      d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'), //contains country detailed information
    // use tsvdata.continent for Europe and North America
    // tsvdata.name for Japan
    // Global -> select all
    // other sales -> select all except JP, NA, EU
    // use d.iso_n3 for id refering in json
      d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
//      d3.csv("./data/video_games.csv")  //video game
    ]).then (function ([tsvData, topoJSONdata]){

        let filter_data2 = data.filter(d => {return yearrange(start_year, end_year, d.Year);})
                                .filter(d => {return chooseSelection(plat, d.Platform);})
//        console.log(filter_data2)
        // get the top genre by the local scales depending on regions
        let globaltopdata = cleanData(filter_data2, function(a, b){ return b.Global_Sales - a.Global_Sales;}, 1);
        let EUtopdata = cleanData(filter_data2, function(a,b){return b.EU_Sales - a.EU_Sales;}, 1);
        let NAtopdata = cleanData(filter_data2, function(a,b){return b.NA_Sales - a.NA_Sales;}, 1);
        let JPtopdata = cleanData(filter_data2, function(a,b){return b.JP_Sales - a.JP_Sales;}, 1);
        let othertopdata = cleanData(filter_data2, function(a,b){return b.Other_Sales - a.Other_Sales;}, 1);

        function defineGenre(d){
            if (d.sales_region === 'Europe'){
                return EUtopdata[0].Genre
            }else if (d.sales_region === 'North America'){
                return NAtopdata[0].Genre
            }else if (d.sales_region === 'Japan'){
                return JPtopdata[0].Genre
            }else{
                return othertopdata[0].Genre
            }
    };

    //    let filter_tsvData = tsvData.filter(d => {return cleanDataRegion(d, regionSelect);});
    //    console.log(filter_tsvData);
        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries).features; // each country property and id is stored in features
    //		console.log(countries);
    // ADD a new column in the tsv file to define EU, NA, Japan and others (for colorscale purpose)
        tsvData.forEach(d => {
              d['sales_region']= defineRegion(d),
              d['top_genre']= defineGenre(d)});
        //console.log(tsvData);
         // get the row from tsv file with the same id as the json
        let countryinfo = {};
        tsvData.forEach(function(d){countryinfo[d.iso_n3] = d});

        const regionValue = function(d){return countryinfo[d.id].sales_region} ;
        colorScale.domain(countries.map(regionValue));

     // define list of id(s) for each region
    //    console.log(countryinfo);


     // Maplegend
            function mapLegend(group){

              const groups = group.selectAll('g')
                .data(colorScale.domain()); //select a group with the color scale domain
              const groupsEnter = groups.enter().append('g');

              groupsEnter
                .merge(groups)
                  .attr('transform', function(d, i) {
                    return `translate(0, ${i * 25})`;}
                  );


              groups.exit().remove();
              groupsEnter.append('circle')
                .merge(groups.select('circle'))
                  .attr('r', 6)
                  .attr('fill', colorScale);

              let topGenre = function(d){
                      if (d === 'Europe'){
                          return EUtopdata[0].Genre
                      }else if (d === 'North America'){
                            return NAtopdata[0].Genre
                      }else if (d === 'Japan'){
                            return JPtopdata[0].Genre
                      }else{
                            return othertopdata[0].Genre
                      }};

              groupsEnter.append('text')
                .merge(groups.select('text'))
                  .text(function(d){return d + ": " +topGenre(d)})
                  .attr('dy', '5px')
                  .attr('x', 10)//text offset
                  .style('fill', '#635F5D');


             group.append("text")
                .attr("transform", `translate(${0},${-20})`)
                .attr("text-anchor", "left")
                .text('Top Genre in:')
                .style('fill', '#635F5D');

            };


            legendG.call(mapLegend)

    // set up mouseover and mouseout func
            const genre_name = function(d){return countryinfo[d.id].top_genre} //set genre name
            let mouseOver = function(d) {
                let color_span = `<span style="color: ${colorScale(regionValue(d))};">`;
                let html = `Sales Region: ${color_span}${regionValue(d)}</span><br/>
                        Most Popular Game Genre: ${color_span}${genre_name(d)}</span>`;
                tooltip.html(html)
                    .style("left", `${(d3.event.pageX) - 50}px`)
                    .style("top", `${(d3.event.pageY)-60}px`)// Show the tooltip and set the position relative to the event X and Y location
                    .style("box-shadow", `2px 2px 3px ${colorScale(regionValue(d))}`)
                    .transition()
                    .duration(200)
                    .style("fill", 'white')
                    .style("opacity", 0.9)
            };

             let mouseOut = function(d) {
           // Set opacity back to 0 to hide
              tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            };


            svg_map
            .selectAll('path')
            .data(countries)
            .enter()
            .append('path')
            .attr('class', 'countries')
            .attr('d', pathGenerator)
            .attr('fill', d => colorScale(regionValue(d)))
            .on("mouseover", mouseOver )
            .on("mouseout", mouseOut)
            ;
           // Add a title
           svg_main
           .append("text")
           .attr('class', 'title')
            .attr("transform", `translate(${(innerwidth_2/2)},-15)`)
            .attr("text-anchor", "middle")
            .text("Most Popular  " + platdisplay(select_plat) +' Game ' + "Genre in 4 Sales Regions " + yeardisplay(start_year, end_year));

    });}
//
//d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.tsv')
//    .then(function(data){
//        console.log(data)
//    });


//
function defineRegion(d){
       if (d.continent === 'Europe' || d.continent === 'North America'){
            return d.continent ;
       }else if (d.name === 'Japan'){
            return d.name;
       }else{
            return ('Other');
       }
}


//




//data cleaning based on the region selected



function filterDataRegion(data, regionSelect){
    if(regionSelect === 'Global'){
        return (true);
    }else if (regionSelect === 'Europe' || regionSelect === 'North America' ){
        return (data.continent === regionSelect);
    }else if (regionSelect === 'Japan'){
        return (data.name === regionSelect);
    }else {
        return (data.name !== 'Japan' || data.continent !== 'Europe' || data.continent !== 'North America' );
    }

}

