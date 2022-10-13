  require([
     "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/widgets/Home",
    ], function (esriConfig,Map, MapView, FeatureLayer, Legend, Search, Home) {

  // TOP of REQUIRE
  console.log("TOP OF REQUIRE");

  esriConfig.apiKey = "AAPKc484c74fa23948cabcfac16c7aeb0686pq_j3wO_RKSRk5XKsXRfce7zvJdWILL_CQKtXpQW0s0RiIj9nhYN3OT9FnQ9LbzY";


      
  // Arcade Script
  const arcadeScript = document.getElementById("projects-arcade").text;

//      console.log(arcadeScript)
//      console.log(countiesTemplate)

  const soils = new FeatureLayer ({
      url: "https://landscape11.arcgis.com/arcgis/rest/services/USA_Soils_Map_Units/featureserver/0",
      outFields: ["objectid"]
//      renderer: {
//        type: "simple",
//        symbol: {
//            type: "simple-fill",
//    //            style: "none",
//            outline: { 
//                color: "#FFFFFF",
//                width: "1px"
//                }
//            }
//        }
  });
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
    spatialReference: {wkid: 3857},
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
      spatialReference: {wkid: 3857},
      popupTemplate: csgTemplate
  });

//  map.add(csgLayer);
   
      
    //Create the map
  const map = new Map({
      basemap: "arcgis-topographic", // Basemap layer
      layers: [counties, csgLayer, soils]
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
    spatialReference: {
        wkid: 3857
    },
    constraints: {
      snapToZoom: false
    }
  });
      
    map.add(counties);
    map.add(csgLayer);
    map.add(soils);
    
    console.log(counties.popupTemplate.content.fieldInfos)
      
  //Click event on counties to highlight surrounding counties
//  view.ui.add("info", "top-right");
  
//  view
//    .when()
//    .then(() => {
//      return counties.when();
//  })
//    .then((layer) => {
//      const renderer = layer.renderer.clone();
//      renderer.symbol.width = 4;
//      renderer.symbol.color = [128, 128, 128, 0.8];
//      layer.renderer = renderer;
//      
//      return view.whenLayerView(layer);
//  })
//    .then((layerView) => {
//      view.on("pointer-move", eventHandler);
//      view.on("pointer-down", eventHandler);
//      
//      function eventHandler(event) {
//        //only include graphics from counties in the hitTest
//        const opts = {
//            include: counties
//        };
//        //the hitTest() chckes to see if any graphics from the counties layer
//        //intersect the x, y coordinates of the pointer
//          view.hitTest(event, opts).then(getGraphics);
//      }
//      
//      let highlight, currentId, currentName;
//      
//      function getGraphics(response) {
//          //the topmost graphic from counties layer
//          //and display select attribute values
//          if (response.results.length) {
//              const graphic = response.results[0].graphic;
//              
//              const attributes = graphic.attributes;
//              const county = attributes.NAME;
//              const state = attributes.STATE_NAME;
//              const id = attributes.FID;
//              
//              if (
//                highlight &&
//                (currentName !== name || currentId !== id)
//              ) {
//                highlight.remove();
//                highlight = null;
//                return;
//              }
//              
//              if (highlight) {
//                  return;
//              }
//              
//              document.getElementById("info").style.visibility = "visible";
//              document.getElementById("county").innerHTML = county + " County";
//              document.getElementById("state").innerHTML = state;
//              
//              //highlights all features belonging to the same state
//              const query = layerView.createQuery();
//              query.where = "NAME = '" + county + "'";
//              // Try to do it with Spatial query
////              query.geometry = view.toMap(event);
////              query.distance = 200;
////              query.unites = "miles";
////              query.spatialRelationship = "intersects";
//              query.returnGeometry = true;
////              query.outfields = ["NAME","STATE_NAME"];
////              query.outSpatialReference = this.view.spatialReference
//              
//              layerView.queryFeatures(query).then((ids) => {
////                console.log(response.features[0].attributes)
////              layerView.queryFeatures(query).then((ids) => {
////                      console.log(response.features[0])
//                  
//                  
//                  const features = ids.features;
////                  console.log(features);
////                  console.log(features.graphics)
//                  const attributeData = features.map(feature => {
//                      return feature.attributes;
//                  });
//                  const geometryData = features.map(feature => {
//                      return feature.geometry;
//                  })
////                  console.log(attributeData);
//                  console.log(geometryData);
////                  console.log(ids.geometryType)
////                  console.log(ids.queryGeometry)
//                  
//                  
//                  // Instead of highlighting this query, I need to pass this result into a spatial query 
//                  //and highlight that
////                  const spatial_query = layerView.createQuery();
////                  query.geometry = geometryData.polygon;
////                  query.spatialRelationship = "intersects";
//                  
////                  layerView.queryObjectIds(spatial_query).then((id) => {
//                      console.log(ids.features);
//                  
//                      if (highlight) {
//                      highlight.remove();
//                  }
//                  highlight = layerView.highlight(id);
//                  currentName = name;
//                  currentId = id;
//               
//              });
//          } else {
//              //remove the highlight if no features are returned from the hitTest
//              if (highlight) {
//                  highlight.remove();
//                  highlight = null;
//              }
//              document.getElementById("info").style.visibility = "hidden";
//          }
//      }
//  });
//  
////    view
////    .when()
////    .then(() => {
////      return counties.when();
////  })
////    .then((layer) => {
////      const renderer = layer.renderer.clone();
////      renderer.symbol.width = 4;
////      renderer.symbol.color = [128, 128, 128, 0.8];
////      layer.renderer = renderer;
////      
////      return view.whenLayerView(layer);
////  })
////  
////  .then((layerView) => {
////  view.on("pointer-move", eventHandler);
////  view.on("pointer-down", eventHandler);
////
////  function eventHandler(event) {
////    //only include graphics from counties in the hitTest
////    const opts = {
////        include: counties
////    };
////    //the hitTest() chckes to see if any graphics from the counties layer
////    //intersect the x, y coordinates of the pointer
////      view.hitTest(event, opts).then(getGraphics);
////  }
////        
////  //Spatial Query
////  let highlight;
////  view.on("pointer-move", function(event){
//////    view.whenLayerView(counties).then(function(layerView){
////    let query = layerView.createQuery();
////    query.geometry = view.toMap(event);
////    query.distance = 200;
////    query.units = "miles";
////    query.spatialRelationship = "intersects";
////    query.returnGeometry = true;
////    query.outfields = ["NAME","STATE_NAME"];
////    
////    layerView.queryFeatures(query)
////      .then(function(result){
////            if (highlight) {
////                highlight.remove();
////               }
////               highlight = layerView.highlight(result.features);
////              })
////            });
////});
////      
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