  require([
     "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/widgets/Home"
    ], function (esriConfig,Map, MapView, FeatureLayer, Legend, Search, Home) {
      
 (async () => {    
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
      layers: [counties]
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
//    map.add(counties);
////    map.add(csgLayer);
      
      
  //Click event on counties to highlight surrounding counties
  view.ui.add("info", "top-right");
  
  const featureLayerView = await view.whenLayerView(counties);


  view.on("pointer-move", (event) => {
       
          //**Only show counties within x miles of cursor
          featureLayerView.effect = {
            filter: {
              geometry: view.toMap(event),
              spatialRelationship: "intersects",
              distance: 30,
              units: "miles"
            },
          includedEffect: "invert() bloom(1.5, 0.1px, 0)"
//          includedEffect:  "brightness(5) hue-rotate(270deg) contrast(200%)"
          };
      });
       
//    Display the names of counties being filtered
      view.on("pointer-move", async (event) => {
          const query = {
              geometry: view.toMap(event),
              spatialRelationship: "intersects",
              distance: 30,
              units: "miles",
              outStatistics: [
                  {
                      onStatisticField: "NAME",
                      outStatisticFieldName: "count_of_county",
                      statisticType: "count"
                  }
              ]
          };
          const featureSet = await featureLayerView.queryFeatures(query);
          const {
              features: [{
                  attributes: {
                      count_of_county
                  }
              }]
          } = featureSet;
          
          const formatter = new Intl.NumberFormat("en-us");
          const counties = formatter.format(count_of_county).padStart(9)
          const label = 'Counties: ${counties}'
          document.getElementById("info").innerText = label;
      });
    
      
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
     
 })();
});
