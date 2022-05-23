  require([
     "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/widgets/Home"
    ], function (esriConfig,Map, MapView, FeatureLayer, Legend, Search, Home) {
      
      
  // TOP of REQUIRE
  console.log("TOP OF REQUIRE");

  esriConfig.apiKey = "AAPKc484c74fa23948cabcfac16c7aeb0686pq_j3wO_RKSRk5XKsXRfce7zvJdWILL_CQKtXpQW0s0RiIj9nhYN3OT9FnQ9LbzY";


      
  // Arcade Script
  const arcadeScript = document.getElementById("projects-arcade").text;

//      console.log(arcadeScript)
//      console.log(countiesTemplate)

  const counties = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer/0",
    title: "USA Counties (Generalized)",
    outFields: ["*"],
    renderer: {
    type: "simple",
    symbol: {
        type: "simple-fill",
//            style: "none",
        outline: { 
            color: "#FFFFFF",
            width: "1px"
            }
        }
    },
    definitionExpression: "STATE_NAME = 'Minnesota'",
    opacity: "0.7",   
  });

//  map.add(counties); 

  // County layer popup 
  counties.popupTemplate = {
      title: "{NAME} County",
      content: [{
          type: "fields",
          fieldInfos: [{
              fieldName: "expression/surrounding_counties"}]
          }],
      expressionInfos:[{
          name: "surrounding_counties",
          title: "Bordering Counties",
          expression: arcadeScript}]
  };



  // Style csgLayer by 'Program' renderer
  const csgRenderer = {
   type: "unique-value",
   field: "Program",
   defaultSymbol: { type: "simple-marker"},
   uniqueValueInfos: [{
       value: "MN CSG 1.0",
       symbol: {
         type: "simple-marker",
         color: "#d92b30"
       }
    }, {
       value: "MN CSG 2.0",
       symbol: {
         type: "simple-marker",
         color: "#0095ba"
       }
    }, {
       value: "MN CSG VOS17",
       symbol: {
          type: "simple-marker",
          color: "#3cccb4"
       }
    }, {
       value: "MN CSG VOS18",
       symbol: {
          type: "simple-marker",
          color: "#3cccb4"
        }
    }, {
       value: "MN CSG VOS19",
       symbol: {
          type: "simple-marker",
          color: "#ab52b3"
        }
    }, { 
       value: "MN CSG VOS20",
       symbol: {
          type: "simple-marker",
          color: "#ffdf3c"
        }
    }, {
       value: "DG project",
       symbol: {
          type: "simple-marker",
          color: "#c27c30"
        } 
    }]
  };

  // Set csg labeling info
  const csgLabels = {
      symbol: {
          type: "text",
          color: "#000000",
          haloColor: "#FFFFFF",
          haloSize: "2px",
          font: {
            size: "12px",
            family: "Noto Sans",
//                style: "italic",
            weight: "normal"
          }
        },

        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "$feature.Deal_Name"
        }
      };

  // CSG Popup template
  const csgTemplate = {
    title: "{Deal_Name}",
    content: [{
        type: "fields",
        fieldInfos: [{
            fieldName: "Program",
            label: "Program",               
        }, {
            fieldName: "SITE_COUNTY",
            label: "County"
        },{
            fieldName: "Stage",
        },{
            fieldName: "Premises_Acres",
            lable: "Site Acres"
        }]
    }]
  };
  const csgLayer = new FeatureLayer({
      url: "https://services5.arcgis.com/V5xqUDxoOJurLR4H/arcgis/rest/services/MN_USS_Sites_Won_Centroids/FeatureServer/0",
      renderer: csgRenderer,
      labelingInfo: [csgLabels],
      legendEnabled: true,
      title: "MN USS CSG Sites Won",
      popupTemplate: csgTemplate
  });

//  map.add(csgLayer);
   
      
    //Create the map
  const map = new Map({
      basemap: "arcgis-topographic", // Basemap layer
      layers: [counties, csgLayer]
  });

  //Create the view
  const view = new MapView({
    map: map,
    popup: {
        dockEnabled: true,
        dockOptions:{
            buttonEnabled: true,
            breakpoint: false,
            position: "bottom-right"
        }
    },
    center: [-94.6859, 46.4296], //moved when adding the header
//        center: [-94.6859, 46.7296],
    zoom: 7, // scale: 72223.819286
    container: "viewDiv",
    constraints: {
      snapToZoom: false
    }
  });
    map.add(counties);
    map.add(csgLayer);
      
      
  //Click event on counties to highlight surrounding counties
  view.ui.add("info", "top-right");
  
  let highlight;
  
//  view.when(function () {
//      showCounties(view);
//  });
// 
//  function showCounties(view) {
  view.whenLayerView(counties).then(function(layerView){
      view.on("pointer-move", function(event){
       
          //**Only show counties within x miles of cursor
          layerView.effect = {
            filter: {
              geometry: view.toMap(event),
              spatialRelationship: "intersects",
              distance: 30,
              units: "miles"
            },
//          includedEffect: "invert() bloom(1.5, 0.1px, 0)"
//          includedEffect:  "brightness(5) hue-rotate(270deg) contrast(200%)"
          includedEffect: "drop-shadow(3px, 3px, 3px, blue)"
          };
      });
       
          
//          const query = layerView.effect.filter.createQuery();
          const query = {
              geometry: view.toMap(event),
              spatialRelationship: "intersects",
              distance: 30,
              units: "miles"
//              orderByFields = ["STATE_NAME DESC"]
          };
          let list = "";
          layerView.queryFeatures(query).then(function (results) {
              if (results.features.length > 0) {
                  results.features.forEach(function (feature) {
                      list = list + '<a href="${feature.attributes.metadata}">${feature.attributes.NAME}</a><br/>';
                  });
              }
          })
////    Display the names of counties being filtered
//      view.on("pointer-move", function(event){
//          const query = {
//              geometry: view.toMap(event),
//              spatialRelationship: "intersects",
//              distance: 30,
//              units: "miles",
//              outStatistics: [
//                  {
//                      onStatisticField: "NAME",
//                      outStatisticFieldName: "count_of_county",
//                      statisticType: "count"
//                  }
//              ]
//          };
//          const featureSet = layerView.queryFeatures(query);
//          const {
//              features: [{
//                  attributes: {
//                      count_of_county
//                  }
//                }
//            ]} = featureSet;
//          
//          const formatter = new Intl.NumberFormat("en-us");
//          const counties = formatter.format(count_of_county).padStart(9)
//          
//          document.getElementById("info").innerText = label;
//      });
//    
//      let query = counties.createQuery();
//      query.geometry = view.toMap(event);
//      query.distance = 200;
//      query.spatialRelationship = "intersects";
//      query.returnGeometry = true;
//      query.outFields = ["STATE_NAME","NAME"];
//      
//      layerView.queryFeatures(query)
//        .then(function(response){
//          //returns a feature set with features containing the
//          //state name and county name attribute and each feautres geometry
////          console.log(response.features[0].attributes)
////          if (highlight) {
////              highlight.remove();
////          }
//          highlight = layerView.highlight(response.features);
//          view.hitTest(event).then(function(response){
//              if (response.results.length) {
//                  let graphic = response.results.filter(function(result) {
//                      return result.graphic.layer === counties;
//                  })[0].graphic;
//                  
//                  view.whenLayerView(graphic.layer).then(function(layerView){
//                      layerView.highlight(graphic);
//                  });
//              }
//          });
//      })
//    });
//  }); 


//// Use filter to only show features within 200 miles of curosr
//  const featureLayerView = await view.whenLayerView(counties);
//
//  view.on("pointer-move", (event) => {
//      featureLayerView.filter = {
//          geometry: view.toMap(event),
//          spatialRelationship: "intersects",
//          distance: 200,
//          units: "miles"
//      };
//  });
      
    
//  let stateChart;
//       
//  let highlightHandle = null;
//      
//  view.when().then(function () {
//      createCharts();
//      
//      const layer = map.layers.getItemAt(0);
//      layer.outFields = [
//          "NAME",
//          "STATE_NAME"
//      ];
//      
//      view.whenLayerView(layer).then(function (layerView) {
//          watchUtils.whenFalseOnce(layerView, "updating", function (val) {
//              //query layer statistics as the user clicks or drags
//              view.on(["click", "drag"], function (event) {
//                  //disables navigation by pointer drag
//                  event.stopPropagation();
//                  queryStatsOnDrag(layerView, event)
//                    .then(updateCharts)
//                    .catch(function (error) {
//                      if (error.name !== "AbortError") {
//                          console.error(error);
//                      }
//                  });
//              });
//          });
//      });
  });
//  //query statistics against the layer view at the screen location
//  var queryStatsOnDrag = promiseUtils.debounce(function (
//      layerView,
//      event
//    ) {
//      //create a query object for the highlight and statistics query
//      
//      const query = layerView.layer.createQuery();
//      query.geometry = view.toMap(event);
//      query.distance = 200;
//      query.units = "miles";
//      
//      const statsQuery = query.clone();
//      
//      //date used to calculae average time
//      const dataDownloadDate = Date.UTC(2018, 6, 5);
//      
//      //create the ststistics definitions for querying stats fro mthe layer view on the 
//      //'outStatisticFieldName'
//      const statDefinitions = [
//          {
//            onStatisticField: "STATE_NAME",
//            outStatisticFieldName: "STATE_NAME",
//            statisticType: "count"
//          }
//      ];
//      
//      //add the stat definitions to the statistics query object cloned
//      statsQuery.outStatistics = statDefinitions;
//      
//      //execute the query for all features in he layer view
//      const allStatsResponse = layerView.queryFeatures(statsQuery).then(
//        function (response) {
//            const stats = response.features[0].attributes;
//            return stats;
//        },
//        function (e) {
//            console.error(e);
//        }
//      );
//      
//      const openStatsQuery = statsQuery.clone();
//      openStatsQuery.where = "NAME = 'Hennepin'";
//      
//      //execute the query only for hennehpin county
//      const unsolvedStatsResponse = layerView
//        .queryFeatures(openStatsQuery)
//        .then(
//            function (response) {
//                const stats = response.feautres[0].attributes;
//                return stats;
//            },
//            function (e) {
//                console.error(e);
//            });
//      
//      //highlist all features within the query distance
//      layerView.queryObjectIds(query).then(function (ids) {
//          if (highlightHandle) {
//              highlightHandle.remove();
//              highlightHandle = null;
//          }
//          highlightHandle = layerView.highlight(ids);
//      });
//      
//      //return the promises that will resolve the each set of statistics
//      return promiseUtils.eachAlways([
//          allStatsResponse,
//          unsolvedStatsResponse
//      ]);
//  });
//    
//    function updateCharts(responses) {
//        const allStats = responses[0].value;
//        const unsovledStats = responses[1].value;
//        
//        const yearChartStats = {
//            solved: [
//                allStats.STATE_NAME - unsolvedStats.STATE_NAME
//            ],
//            unsolved: [
//                unsolvedStates.STATE_NAME
//            ]
//        };
//        updateChart(stateChart, yearChartStats);
//        
//        function createCharts() {
//            state = document.getElementById("info");
//            
//            const stateCanvas = document.getElementbyID("state");
//            stateChart = new Chart(stateCanvas.getContext("2d"), {
//                type: "bar",
//                data: {
//                    laels: [
//                        "1",
//                        "2",
//                        "3"
//                    ],
//                    datasets: [
//                        {
//                            label: "State Name",
//                            stack:"Stack 0",
//                            data: [0,0,0]
//                        },
//                    ]
//                },
//                options: {
//                    responsive: false,
//                    legend: {
//                        position: "top"
//                    },
//                    title: {
//                        display: true,
//                        text: "State NaAEm"
//                    },
//                    scale: {
//                        xAxes: [
//                            {
//                                stacked: true
//                            }
//                        ],
//                        yAxes: [
//                            {
//                                stacked: true,
//                                ticks: {
//                                    beginAtZero: true
//                                }
//                            }
//                        ]
//                    }
//                }
//            });
//        };
//    };

  
      
  const legend = new Legend({
      view: view,
      layerInfos: [
          {
              layer: csgLayer
          }
      ]
  });

  // Add search for Project widget
  const searchWidget = new Search({
      view: view,
      allPlaceholder: "Search for project",
      includeDefaultSources: false,
      sources: [
          {
            layer: csgLayer,
            searchFields: ["Deal_Name"],
            displayField: "Deal_Name",
            exactMatch: false,
            outFields: ["Deal_Name", "Program"],
            name: "CSG Project",
            placeholder: "example: USS Good Solar LLC"
          }
        ]
  });

  const home = new Home({
      view: view
  });

  // Add search 
  view.ui.add(searchWidget, {position: "top-right"});

  // Add legend 
  view.ui.add(legend, "bottom-left");

  //Add Home button
  view.ui.add(home, "top-left")

  // TO DOs:
      //Add funtionality where click on anything and get list of projects in that county and all adjacent counties
      //Search for Project, get list of projects in surrounding counties
      
 

  console.log("BOTTOM OF REQUIRE");
});
