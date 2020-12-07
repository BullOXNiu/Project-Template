var line1 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "vconcat": [{
        "data": {
        //   "url":"https://api.covidtracking.com/v1/states/current.csv"
            "url":"./data/refugee.csv"
        },
        "transform": [{
            "filter": "datum.Total >= 1000000"
        }],
        "width": 480,
        "height": 360,
        // "height": {"step": 1},
        "mark": {
            "type": "line"
        },
        "encoding": {
            "x": {"field": "Year", "type": "temporal", "title": "Year"},
            "y": {"field": "Total", "type": "quantitative", "title": "Total Refugee Population"},
            // "color": {"field": "Country of origin", "type": "nominal"},
            "color": {
                "condition": {
                    "selection": "hover",
                    "field": "Country of origin",
                    "type": "nominal",
                    "legend": null
                },
                "value": "grey"
            },
            "opacity": {
                "condition": {
                    "selection": "hover",
                    "value": 1
                },
                "value": 0.2
            }
        },
        "layer": [
            {
                "selection": {
                    "hover": {
                        "type": "single",
                        "on": "mouseover",
                        "empty": "all",
                        "fields": ["Country of origin"],
                        "init": {"Country of origin": "Syrian Arab Rep."},
                    }
                },
                "mark": {
                    "type": "line", 
                    "strokeWidth": 10, 
                    "stroke": "transparent", 
                    "point": {
                        "filled": false, 
                        "fill": "white", "size": 50
                    }, 
                    "cursor": "pointer",
                    "tooltip": true
                }
            }, 
            {"mark": "line"},
            {
                "encoding": {
                    "x": {"aggregate": "max", "field": "Year"},
                    "y": {"aggregate": {"argmax": "Year"}, "field": "Total"}
                },
                "layer": [
                    // {"mark": {"type": "circle", "filled": false}}, 
                    {
                        "mark": {"type": "text", "align": "left", "dx": 10, "fontSize": 12},
                        "encoding": {"text": {"field":"Country of origin", "type": "nominal"}}
                    }
                ]
            }
        ],
        "config": {"view": {"stroke": null}},
        "selection": {"brush": {"type": "interval"}}
    }]
}




var bar2 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
        //"url":"https://data.world/polymathic/casualties-of-the-syrian-civil-war 
        "url":"./data/demographics.csv"
    },
    "width": 480,
    "height": 360,
    "selection": {
        "highlight": {"type": "single", "empty": "none", "on": "mouseover"},
        "select": {"type": "multi"}
    },
    "mark": {
        "type": "bar",
        "cornerRadiusTopLeft":4,
        "cornerRadiusTopRight":4,
        "stroke": "black",
        "cursor": "pointer",
        "tooltip": true
      },
    "encoding":{
        "x":{
            "timeUnit": "year",
            "field":"deathdate",
            "type":"ordinal",
            "title":"Year"
        },
        "y":{
            "aggregate":"count",
            "type":"quantitative",
            "title": "Number of Casualties"
        },
        "color":{
            "field":"status",
            "type":"nominal",
            "scale":{
                "domain": ["Civilian","Non-Civilian"],
                "range": [ "#89cff0","#9370DB"]
        },
        "title": "Status of the casualities"
        },
        "fillOpacity": {
            "condition": {"selection": "select", "value": 1},
            "value": 0.3
        },
        "strokeWidth": {
            "condition": [
              {
                "test": {
                  "and": [
                    {"selection": "select"},
                    "length(data(\"select_store\"))"
                  ]
                },
                "value": 2
              },
              {"selection": "highlight", "value": 1}
            ],
            "value": 0
          }
    }
}




var pie2 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
        //"url":"https://data.world/polymathic/casualties-of-the-syrian-civil-war 
        "url":"./data/demographics.csv"
    },
    "width": 480,
    "height": 360,
    "selection": {
        "highlight": {"type": "single", "empty": "none", "on": "mouseover"},
        "select": {"type": "multi"}
    },
    "mark": {
        "type": "arc",
        "innerRadius": 40,
        "stroke": "black",
        "cursor": "pointer",
        "tooltip": true
    },
    "encoding": {
        "theta": {"aggregate":"count","type":"quantitative"},
        "color":{"field":"gender","type":"nominal"},
        "fillOpacity": {
            "condition": {"selection": "select", "value": 1},
            "value": 0.3
        },
        "strokeWidth": {
            "condition": [
              {
                "test": {
                  "and": [
                    {"selection": "select"},
                    "length(data(\"select_store\"))"
                  ]
                },
                "value": 2
              },
              {"selection": "highlight", "value": 1}
            ],
            "value": 0
          }
    },
    "view": {"stroke": null}

}

// var map3 = {
//     "$schema": "https://vega.github.io/schema/vega/v5.json",
//     "width": 750,
//     "height": 480,
//     "autosize": "none",
//     "signals": [
//       {
//             "name": "type",
//             "value": "mercator"
//       },
//       { "name": "scale" },
//       { "name": "center0" },
//       { "name": "center1" }
//     ],
//     "projections": [
//         {
//             "name": "projection",
//             "type": "mercator",
//             "scale": 550,
//             "center": [33, 44]
//         }
//     ],
//     "data": [
//         {
//             "name": "world",
//             "url": "./data/countries-110m.json",
//             "format": {
//                 "type": "topojson",
//                 "feature": "countries"
//             }
//         },
//         {
//             "name": "graticule",
//             "transform": [{ "type": "graticule" }]
//         }
//     ],
//     "marks": [
//         {
//             "type": "shape",
//             "from": {"data": "graticule"},
//             "encode": {
//                 "update": {
//                     "strokeWidth": {"value": 1},
//                     "stroke": {"value": "#BDBDBD"}
//                 }
//             },
//             "transform": [
//                 { "type": "geoshape", "projection": "projection" }
//             ]
//         },
//         {
//             "type": "shape",
//             "from": {"data": "world"},
//             "encode": {
//                 "update": {
//                     "strokeWidth": {"value": 1},
//                     "stroke": {"value": "#000"},
//                     "fill": {"value": "#BDBDBD"},
//                     "zindex": {"value": 0}
//                 },
//                 "hover": {
//                     "strokeWidth": {"value": 2},
//                     "stroke": {"value": "#FF0000"},
//                     "zindex": {"value": 1}
//                 }
//             },
//             "transform": [
//                 {"type": "geoshape", "projection": "projection" }
//             ]
//         }
//     ]
// }

// var line3 = {
//     "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
//     "vconcat": [{
//         "data": {
//         //   "url":"https://api.covidtracking.com/v1/states/current.csv"
//             "url":"./data/unemployment.csv"
//         },
//         // "transform": [{
//         //     // "filter": {"field": "TIME", "gt": "2010"},
//         //     "filter": {"field": "LOCATION", "equal": "TUR"},
//         //     // "filter": {"field": "SUBJECT", "equal": "TOT"},
//         // }],
//         "width": 480,
//         "height": 480,
//         // "height": {"step": 1},
//         "mark": {
//             "type": "line"
//         },
//         "encoding": {
//             "x": {"field": "TIME", "type": "temporal", "title": "Year"},
//             "y": {"field": "Value", "type": "quantitative", "title": "Unemployment Rate"},
//             // "color": {"field": "Country of origin", "type": "nominal"},
//             "color": {
//                 "condition": {
//                     "selection": "hover",
//                     "field": "LOCATION",
//                     "type": "nominal",
//                     "legend": null
//                 },
//                 "value": "grey"
//             },
//             "opacity": {
//                 "condition": {
//                     "selection": "hover",
//                     "value": 1
//                 },
//                 "value": 0.2
//             },
//         },
//         "layer": [
//             {
//                 "selection": {
//                     "hover": {
//                         "type": "single",
//                         "on": "mouseover",
//                         "empty": "all",
//                         "fields": ["LOCATION"],
//                         "init": {"LOCATION": "TUR"}
//                     }
//                 },
//                 "mark": {
//                     "type": "line", 
//                     "strokeWidth": 10, 
//                     "stroke": "transparent", 
//                     "point": {
//                         "filled": false, 
//                         "fill": "white", 
//                         "size": 50
//                     },
//                     "cursor": "pointer",
//                     "tooltip": true
//                 }
//             }, 
//             {"mark": {
//                 "type": "line"
//             }}, 
//             {
//                 "encoding": {
//                     "x": {"aggregate": "max", "field": "TIME"},
//                     "y": {"aggregate": {"argmax": "TIME"}, "field": "Value"}
//                 },
//                 "layer": [
//                     // {"mark": {"type": "circle", "filled": false}}, 
//                     {
//                         "mark": {"type": "text", "align": "left", "dx": 10, "fontSize": 12},
//                         "encoding": {"text": {"field":"LOCATION", "type": "nominal"}}
//                     }
//                 ]
//             }
//         ],
//         "config": {"view": {"stroke": null}},
//         "selection": {"brush": {"type": "interval"}}
//     }]
// }

vegaEmbed('#line1', line1);
vegaEmbed('#bar2', bar2);
vegaEmbed('#pie2', pie2);
// vegaEmbed('#map3', map3);
// vegaEmbed('#line3', line3);
