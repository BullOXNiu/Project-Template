width = window.innerWidth - 10;
height = window.innerHeight - 10 - 20
document.querySelector("#map").style.height = (height * .90)  + "px";
document.querySelector("#options").style.height = height + "px";
document.querySelector("#bargraph").style.height = height + "px";
document.querySelector("#map").style.width = (width *  .55)  + "px";
document.querySelector("#options").style.width = (width *.19) + "px";
document.querySelector("#bargraph").style.width = (width *.26) + "px";
document.querySelector("#values").style.width = (width *  .30)  + "px";
width = width * .53;

years = null;

bubbleradius = 2;

plotMap = (ldata,width,height) =>{
  d3.select("#map").select("svg").remove();
  var tlength = ldata.features.length;  

  colordata = []; 
  for (ilen = 0; ilen < tlength; ilen++){
       colordata.push(ilen);
  } 

  evlist = [];
  for (ikey in eventslist){
       evlist.push(ikey);
  }      
  sevlist = [];
  for (ikey in subeventslist){
       sevlist.push(ikey);
  }      
 
  var mapcolor = d3.scaleOrdinal().domain(colordata).range(["#F0F8FF", "#FAEBD7", "green", "yellow", "#39CCCC", "indigo", "pink", "orange", "slateblue", "#01FF70", "orange"])
  var eventcolor = d3.scaleOrdinal().domain(evlist).range(d3.schemeSet3);
  var eventcolor = d3.scaleOrdinal().domain(sevlist).range(d3.schemeSet3);

  projection = d3.geoMercator()
                 .scale(1).translate([0,0]);
  path = d3.geoPath()
           .projection(projection);
  zoom = d3.zoom().on("zoom", redraw)
  svg = d3.select("#map").append("svg")
          .attr("width", width - 20)
          .attr("height", height-20)
          .call(zoom)
  geodatas = svg.append("g")
                .attr("id", "geodata")
  var bounds = path.bounds(ldata); 
  var s = 0.95 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height);
  var t = [(width - s * (bounds[1][0] + bounds[0][0])) / 2, (height - s * (bounds[1][1] + bounds[0][1])) / 2];
  projection
       .scale(s)
       .translate(t);
  
  initscale = s;
  initpos = t;

  totlength = 1;
  geodatas.selectAll("path")   // select all the current path nodes
          .data(ldata.features)      // bind these to the features array in json
          .enter().append("g")
          .append("path")   // if not enough elements create a new path
          .attr("district",function(d){return d.properties["NAME_EN"] })
          .attr("d", function(d,i){if (totlength >= tlength){}; totlength++; return path(d)}) 
          .attr("stroke",function(d,i){return mapcolor(i);})
          .attr("fill",function(d,i){return mapcolor(i);})
          .attr("stroke-opacity","0.15")
          .attr("stroke-width","1.5992146573524155")
          .attr("name",function(d){return d.properties.name;})


  geodatas.selectAll("text")
          .data(ldata.features)      // bind these to the features array in json
          .enter().append("g")
          .append("text")  
          .attr("class", "place-label")
          .attr("transform", function(d) { cent = path.centroid(d); return "translate(" + cent[0] + "," + cent[1] + ")"; })
          .attr("dy", ".35em")
          .attr("font-size","10")
          .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
          .style("fill",function(d){
                 return  "block"
          })   
          .text(function(d){return d.properties.description;}) 

  geodatas.selectAll("st-points")   // select all the current path nodes
          .data(processdata)      // bind these to the features array in json
          .enter().append("g")
          .attr("transform","scale(1)")
          .append("circle")   // if not enough elements create a new path
          .attr("class", "st-points")
          .attr("data",function(d){return JSON.stringify(d.data)})
          .attr("r",function(d){
                if (document.getElementById("events").value == "Event Types"){
                    key = d.location   //+"-"+d.event;
                    total = consolidated[key].count
                    r  =  bubbleradius * (d.count/total);       
                    return r;
                }else{
                    key = d.location+"-"+d.event  //+"-"+d.sevent;
                    total = consolidated[key].count;
                    r  =  bubbleradius * (d.count/total);       
                    return r;
                }
           })
          .attr("cx",function(d){points = projection([parseFloat(d.data[0].LONGITUDE),parseFloat(d.data[0].LATITUDE)]);return points[0] })
          .attr("cy",function(d){points = projection([parseFloat(d.data[0].LONGITUDE),parseFloat(d.data[0].LATITUDE)]); return points[1] })
          .attr("fill",function(d){
                if (document.getElementById("events").value == "Event Types"){
                    return eventcolor(d.event);  
                }else{
                    return eventcolor(d.sevent);  
                }
          })        
          .attr("stroke",function(d){
                return "#000";
          })      




}

window.onresize = resize

redraw = () =>{ 
  zoomchanged = true;
  geodatas.attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
//  geodatas.selectAll(".st-points").attr("r",function (d){ if (d3.event.transform.k > 5.5) {return 5/d3.event.transform.k} else {return .5} })
}  

function resize(){
   width = window.innerWidth - 10;
   height = window.innerHeight - 10 - 20
   document.querySelector("#map").style.height = (height * .90)  + "px";
   document.querySelector("#options").style.height = height + "px";
   document.querySelector("#bargraph").style.height = height + "px";
   document.querySelector("#map").style.width = (width *  .55)  + "px";
   document.querySelector("#options").style.width = (width *.19) + "px";
   document.querySelector("#bargraph").style.width = (width *.26) + "px";
   document.querySelector("#values").style.width = (width *  .30)  + "px";
   width = width * .53;
   plotMap(gdata,width,height);
   plotGraph(width,height);
}

d3.json("layer/mecountries.json")
  .then(function(data){
     console.log(data); 
     ngdata = {};
     ngdata.type = "FeatureCollection"
     ngdata.features = [];
     for (idata = 0;idata < data.features.length; idata++){
          if (data.features[idata].properties.name.toUpperCase() == "ALGERIA"){   // || data.features[idata].properties.name.toUpperCase() == "TUNISIA" || data.features[idata].properties.name.toUpperCase() == "MOROCCO"){
              continue;
          }
          ngdata.features.push(data.features[idata])          
     }
     gdata = ngdata;
     d3.csv("data/MiddleEast_2015-2020_Nov28.csv")
       .then(function(data){
           events = {};
           eventslist = {};
           subeventslist = {};   
           years = {};
           for (idata = 0; idata < data.length; idata++){
                if (!events[data[idata]["YEAR"]]){ 
                     events[data[idata]["YEAR"]] = {};
                } 
                if (!years[data[idata]["YEAR"]]){ 
                     years[data[idata]["YEAR"]] = {};
                } 
                if (!events[data[idata]["YEAR"]][data[idata]["COUNTRY"]]){ 
                     events[data[idata]["YEAR"]][data[idata]["COUNTRY"]] = {};
                } 
                if (!events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]]){ 
                     events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]] = {};
                } 
                if (!events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]]){ 
                    events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]] = {};
                }
                if (!events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]]){
                     events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]] = {};
                     events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]].counts = 0;
                     events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]].data = [];
                }       
                events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]].counts = events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]].counts+1;
                events[data[idata]["YEAR"]][data[idata]["COUNTRY"]][data[idata]["LOCATION"]][data[idata]["EVENT_TYPE"]][data[idata]["SUB_EVENT_TYPE"]].data.push(data[idata]);
                if (!eventslist[data[idata]["EVENT_TYPE"]]){
                     eventslist[data[idata]["EVENT_TYPE"]] = "";
                }        
                if (!eventslist[data[idata]["SUB_EVENT_TYPE"]]){
                     subeventslist[data[idata]["SUB_EVENT_TYPE"]] = "";
                }        

          } 
          changeoption('') 
          ticks = [];
          ticklabels = [];
          tickpositions = []; 
          counter = 0;
          pos = 0; 
          for (iyear in years){
              ticks.push(String(iyear)); 
              ticklabels.push(String(iyear));  
              pos = pos+20;   
         }
         $("#yearslider").css("visibility","visible") 
         $("#yearslider").slider({
            ticks: ticks,
            tickLabels:ticklabels
        });
   });
});


Date.prototype.getMonthName = function() {
    var monthNames = [ "January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December" ];
    return monthNames[this.getMonth()];
}


function changeoption(year){
console.log(year);
   if (document.getElementById("events").value == "Event Types"){
       processdata = []; 
       for (iyear in events){
            if (year){
                if (year != iyear){
                    continue;
                }
            }    
            for (icountry in events[iyear]){
                 for (ilocation in events[iyear][icountry]){
                      for (ievent in events[iyear][icountry][ilocation]){ 
                           icheck = -1;
                           for (ichecks =0; ichecks < processdata.length; ichecks++){
                                if (processdata[ichecks].year === iyear && processdata[ichecks].country === icountry && processdata[ichecks].location === ilocation && processdata[ichecks].event === ievent){
                                    icheck = ichecks;
                                    break;   
                                }
                           }    
                           if (icheck == -1){ 
                               l = {};
                               l.year = iyear;
                               l.country = icountry;
                               l.location = ilocation;
                               l.event = ievent;
                               l.data = [];
                               l.count = 0;     
                           }  
                           for (isevent in events[iyear][icountry][ilocation][ievent]){
                                if (icheck == -1){ 
                                    l.count += events[iyear][icountry][ilocation][ievent][isevent].counts;
                                    for (itemdata = 0; itemdata < events[iyear][icountry][ilocation][ievent][isevent].data.length; itemdata++){
                                         l.data.push(events[iyear][icountry][ilocation][ievent][isevent].data[itemdata]); 
                                    }
                                }else{
                                    processdata[ichecks].count = processdata[ichecks].count + events[iyear][icountry][ilocation][ievent][isevent].counts;
                                    for (itemdata = 0; itemdata < events[iyear][icountry][ilocation][ievent][isevent].data.length; itemdata++){
                                         processdata[ichecks].data.push(events[iyear][icountry][ilocation][ievent][isevent].data[itemdata]); 
                                    } 
                                }
                           }
                           if (icheck == -1){ 
                               processdata.push(l);
                           }
                       } 
                   }
              }
              if (!year){
                  break;    
              }
         }
         consolidated = {};
         for (iprocess = 0; iprocess < processdata.length; iprocess++){
              key = processdata[iprocess].location    //+"-"+processdata[iprocess].event;
              if (!consolidated[key]){                         
                  consolidated[key] = {}
                  consolidated[key].count = 0;
                  consolidated[key].data = [];
              }
              consolidated[key].count += processdata[iprocess].count;
              for (idata = 0; idata < processdata[iprocess].data.length; idata++){
                   consolidated[key].data.push(processdata[iprocess].data[idata]);
              }    
          }       
      }else{
          processdata = []; 
          for (iyear in events){
               if (year){
                   if (year != iyear){
                       continue;
                   }
               }    
               for (icountry in events[iyear]){
                    for (ilocation in events[iyear][icountry]){
                         for (ievent in events[iyear][icountry][ilocation]){ 
                              for (isevent in events[iyear][icountry][ilocation][ievent]){ 
                                   icheck = -1;
                                   for (ichecks =0; ichecks < processdata.length; ichecks++){
                                        if (processdata[ichecks].year === iyear && processdata[ichecks].country === icountry && processdata[ichecks].location === ilocation && processdata[ichecks].event === ievent && processdata[ichecks].sevent === isevent){
                                            icheck = ichecks;
                                            break;   
                                        }
                                   }    
                                   if (icheck == -1){ 
                                       l = {};
                                       l.year = iyear;
                                       l.country = icountry;
                                       l.location = ilocation;
                                       l.event = ievent;
                                       l.sevent = isevent;
                                       l.data = [];
                                       l.count = 0;     
                                       l.count += events[iyear][icountry][ilocation][ievent][isevent].counts;
                                       for (itemdata = 0; itemdata < events[iyear][icountry][ilocation][ievent][isevent].data.length; itemdata++){
                                            l.data.push(events[iyear][icountry][ilocation][ievent][isevent].data[itemdata]); 
                                       }
                                   }else{
                                       processdata[ichecks].count = processdata[ichecks].count + events[iyear][icountry][ilocation][ievent][isevent].counts;
                                       for (itemdata = 0; itemdata < events[iyear][icountry][ilocation][ievent][isevent].data.length; itemdata++){
                                            processdata[ichecks].data.push(events[iyear][icountry][ilocation][ievent][isevent].data[itemdata]); 
                                       } 
                                  }
                              }
                              if (icheck == -1){ 
                                  processdata.push(l);
                              }
                         } 
                    }
               }
               if (!year){
                   break;    
               }     
          }
          consolidated = {};
          for (iprocess = 0; iprocess < processdata.length; iprocess++){
               key = processdata[iprocess].location+"-"+processdata[iprocess].event   //+"-"+processdata[iprocess].sevent;
               if (!consolidated[key]){                         
                   consolidated[key] = {}
                   consolidated[key].count = 0;
                   consolidated[key].data = [];
               }
               consolidated[key].count = consolidated[key].count+processdata[iprocess].count;
               for (idata = 0; idata < processdata[iprocess].data.length; idata++){
                    consolidated[key].data.push(processdata[iprocess].data[idata]);
               }    
          }  
      } 
      monthscounts = {};
      monthscounts["Jan"] = 0;
      monthscounts["Feb"] = 0;
      monthscounts["Mar"] = 0;
      monthscounts["Apr"] = 0;
      monthscounts["May"] = 0;
      monthscounts["Jun"] = 0;
      monthscounts["Jul"] = 0;
      monthscounts["Aug"] = 0;
      monthscounts["Sep"] = 0;
      monthscounts["Oct"] = 0;
      monthscounts["Nov"] = 0;
      monthscounts["Dec"] = 0;    
      for (idata = 0; idata < processdata.length; idata++){
           for (idata1 = 0; idata1 < processdata[idata].data.length; idata1++){
                date =  new Date(processdata[idata].data[idata1]["EVENT_DATE"]);
                month = date.getMonthName().substr(0,3);
                monthscounts[month] = monthscounts[month] + 1;
           }
      }
      graphdata = [];
      for (imonth in monthscounts){
           im = {};
           im.month = imonth;
           im.counts = monthscounts[imonth];
           graphdata.push(im);
      }  
      plotMap(gdata,width,height);
      plotGraph(width,height);
}


function plotGraph(){
   d3.select("#bargraph").select("svg").remove();
   totalcounts = 0;
   for (imonth  = 0; imonth < graphdata.length; imonth++){
        if (graphdata[imonth].counts > totalcounts){ 
            totalcounts =  graphdata[imonth].counts
        }
   } 
   totalcounts = totalcounts * 1.5
   var margin = {top: 20, right: 10, bottom: 50, left: 30},
       width = $("#bargraph").width() - margin.left - margin.right,
       height = $("#bargraph").height() - margin.top - margin.bottom;

   var svg = d3.select("#bargraph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

   var xaxis = d3.scaleLinear()
                 .domain([0, totalcounts])
                 .range([ 0, width]);


   svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xaxis).ticks(5))
              .selectAll("text")
              .attr("transform", "translate(-12,10)rotate(-90)")
              .style("text-anchor", "end");

   var yaxis = d3.scaleBand()
                 .range([ 0, height ])
                 .domain(graphdata.map(function(d) { return d.month; }))
                 .padding(.1);

   svg.append("g").call(d3.axisLeft(yaxis))

   bars = svg.selectAll(".bar")
             .data(graphdata)
             .enter().append("g");

   bars.selectAll("bar")
      .data(graphdata)
      .enter()
      .append("rect")
      .attr("x", xaxis(0) )
      .attr("y", function(d) { return yaxis(d.month); })
      .attr("width", function(d) { return xaxis(d.counts); })
      .attr("height", yaxis.bandwidth() )
      .attr("fill", "green")

   bars.append("text")
         .attr("class", "label")
         .attr("y", function (d) {
             return yaxis(d.month) + yaxis.bandwidth() / 2 + 4;
         })
         .attr("x", function (d) {
             return xaxis(d.counts) + 3;
         })
         .text(function (d) {
             return d.counts;
         }); 
}


$(document).on("change","#yearslider",function(){
   selectedyear = $(this).val();
   changeoption(selectedyear);
})
