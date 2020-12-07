var deaths = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "title" :{
        "text": "Demographics of Casualties per Year",
        "anchor" : "middle",
        "textWeight" : "bold",
        "fontSize" : 30
    },
    "data": {
        //"url":"https://data.world/polymathic/casualties-of-the-syrian-civil-war 
        "url":"./data/demographics.csv"
    },
    "transform":[
        {
            "window":[{"op":"rank","as":"id"}],
            "groupby":["gender", {"timeUnit":"year","field":"deathdate"}]
        }
    ],
    "hconcat": [
        {
            "mark":{
                "type":"bar",
                "cornerRadiusTopLeft":8,
                "cornerRadiusTopRight":8,
                "stroke": "white",
                "cursor": "pointer",
                "tooltip": true
            },
            "width": 480,
            "height": 300,
            "selection":{
                "region": {
                    "type" : "interval",
                    "encodings": ["x"]
                }
            },
            "encoding": {
                "x": {
                    "timeUnit":"year",
                    "field":"deathdate",
                    "type":"ordinal",
                    "title":"Year"
                },
                "y": {
                    "aggregate":"count",
                    "type":"quantitative",
                    "title":"Number of Casualties"
                },
                "color":{
                    "field":"status",
                    "type":"nominal",
                    "scale":{
                        "domain": ["Civilian","Non-Civilian"],
                        "range": [ "#89cff0","#9370DB"]
                    },
                    "title": "Status of Casualities"
                },
            }
        },
        
        {
            "config": {"view": {"stroke": ""}},
            "width": 480,
            "height": 100,
            "mark": {
                "type":"point",
                "baseline":"middle",
                "opacity": 1,
                "tooltip": true,
                "filled": true
            },
            "encoding":{
                "x":{
                    "field":"id",
                    "type":"ordinal",
                    "axis":null
                },
                "y": {
                    "field":"gender", 
                    "type":"ordinal",
                    "title":null,  
                },
                "row": {
                    "field": "deathdate",
                    "timeUnit": "year",
                    "header": {"title": ""}
                },
                "tooltip": [
                    {"field": "name", "type": "nominal", "title":"Name"},
                    {"field":"gender","type":"nominal", "title":"Gender"},
                    {"field":"status","type":"nominal","title":"Status"}
                ],
                "color":{
                    "field":"status",
                    "type":"nominal",
                    "scale":{
                        "domain": ["Civilian","Non-Civilian"],
                        "range": [ "#89cff0","#9370DB"]
                    },
                    "title": "Status of Casualities"
                }
            },
            "transform":[{"filter":{"selection":"region"}}]     
        }
    ]
}



vegaEmbed('#deaths', deaths);