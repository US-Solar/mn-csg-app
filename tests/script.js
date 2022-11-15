  require([
     "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/widgets/Home",
      "esri/popup/content/TextContent"
    ], function (esriConfig,Map, MapView, FeatureLayer, Legend, Search, Home, TextContent) {

  // TOP of REQUIRE
  console.log("TOP OF REQUIRE");
  
//  esriConfig.apiKey = "AAPKc484c74fa23948cabcfac16c7aeb0686pq_j3wO_RKSRk5XKsXRfce7zvJdWILL_CQKtXpQW0s0RiIj9nhYN3OT9FnQ9LbzY";
  
    console.log("TOP OF REQUIRE");
  const webmapId = new URLSearchParams(window.location.search).get("webmap") ?? "8468f4f6ce3c4151883eab89b2020935"; // original 
        //"c840c7c265ff4188a8fff535f8eba389" //dev map

  
      
  // Arcade Script
  const arcadeScript = document.getElementById("projects-arcade").text;

//      console.log(arcadeScript)
//      console.log(countiesTemplate)

  const countyLabels = {
      symbol: {
          type: "text",
          color: "#404040",
          haloColor: [164,164,164, 0.25],
          haloSize: "1.5px",
          font: {
            size: "11px",
            family: "Montserrat",
                style: "italic",
            weight: "normal"
          }
        },

        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "$feature.NAME"
        }
      };
        
  const counties = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer/0",
    title: "USA Counties (Generalized)",
    outFields: ["NAME"],
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
    labelingInfo: [countyLabels],  
    definitionExpression: "STATE_NAME = 'Minnesota'",
    spatialReference: {wkid: 3857},
    opacity: "0.7",   
  });


//  // County layer popup 
//  counties.popupTemplate = {
//      title: "{NAME} County"
////      content: [{
////          type: "fields",
////          fieldInfos: [{
////              fieldName: "expression/surrounding_counties"}]
////          }],
////      expressionInfos:[{
////          name: "surrounding_counties",
////          title: "Bordering Counties",
////          expression: arcadeScript}]
//  };



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
          color: "#ab52b3"
        }
    }, {
       value: "MN CSG VOS19",
       symbol: {
          type: "simple-marker",
          color: "#ffdf3c"
        }
    }, { 
       value: "MN CSG VOS20",
       symbol: {
          type: "simple-marker",
          color: "#c27c30"
        }
    }, {
       value: "DG project",
       symbol: {
          type: "simple-marker",
          color: "#f260a1"
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
            size: "13px",
            family: "Noto Sans",
//                style: "italic",
            weight: "normal"
          }
        },

        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "Replace(Replace($feature.Deal_Name, 'Solar LLC', ''), 'USS', '')"
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
   
      
  //Create the map
  const map = new Map({
       portalItem: {
          id: webmapId
        },
      basemap: "arcgis-topographic", // Basemap layer
//      layers: [csgLayer, counties]
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
    center: [-93.6984, 46.4296], //moved when adding the header
//        center: [-95.8984, 46.4296],
    zoom: 7, // scale: 72223.819286
    container: "viewDiv",
    spatialReference: {
        wkid: 3857
    },
    constraints: {
      snapToZoom: false
    }
  });
    
    // Add Layers to map
    map.add(counties);
    map.add(csgLayer);
      
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

  // Add search widget
  view.ui.add(searchWidget, {position: "top-right"});

  // Add legend widget
  view.ui.add(legend, "bottom-left");

  //Add Home button widget
  view.ui.add(home, "top-left")
  
      
  /////////////////// Query Events//////////////////////////////
//  let highlight;
  view.on("pointer-down", (event) => { 
    const opts = {
          include: counties
      }
      console.log(event);
    view.hitTest(event, opts).then((response) => {
      console.log(response);
      if(response.results.length) {
      
      const graphic = response.results[0].graphic;
      const geom = graphic.geometry;
          
      //Attempt to fix the query issue by zooming in before querying....    
      //only works when you click a second time....
          
      view.goTo({
          center: [geom.centroid.longitude, geom.centroid.latitude], zoom: 9
      })
          console.log([geom.centroid.longitude, geom.centroid.latitude]);
          console.log(geom);
          console.log(graphic);

          console.log(graphic.layer);
         // Found I don't need this because I'm not doing highlights....
//         view.whenLayerView(graphic.layer).then(function(layerView){
         
              const query = counties.createQuery();
              query.set({
                  geometry: geom,
                  spatialRelationship: "intersects",
                  returnGeometry: true,
                  returnQueryGeometry: true,
                  orderByFields: ["NAME DESC"]
              });
              counties.queryFeatures(query).then((featureSet) => {
                  const features = featureSet.features;
//                  const county = features.attributes.AttributesConstructor
//                  console.log(features);
                  const objectIds = features.map(feature => {
                      return feature.attributes;
                  });
                  console.log(objectIds);
//                  console.log(features);
//              if (highlight) {
//                  highlight.remove();
//              }
//              highlight = layerView.highlight(features);
                  
              // Get list of County Names                  
              let output = [];
              let outputPopup = [];
              for(var i = objectIds.length - 1; i >= 0; i --) {
                  outputPopup.push(objectIds[i].NAME);
                  output.push("'"+objectIds[i].NAME+"'");
              }
                console.log(output.join(', ')); 
                console.log(output);
                console.log(outputPopup);
            
            // Update counties popup with list of neighboring counties
            counties.popupTemplate = {
                  title: "{NAME} County"
              };
            let textElement = new TextContent();
            textElement.text = "Eligible Counties: " + output.join(', ');
            
            counties.popupTemplate.content = "<p><b>Eligible Counties</b></p>"+output.join('<p>');
            console.log(textElement);
                  
//        // Query projects from list of counties
          const projectQuery = csgLayer.createQuery();
          projectQuery.where = "SITE_COUNTY IN " + "(" + output.join(', ') + ")"; 
        
          csgLayer.queryFeatures(projectQuery).then((Ids) => {
              const featuresProjects = Ids.features;
              resultFeatures = featuresProjects;
              console.log(Ids);
              const projectAttributes = featuresProjects.map(featuresProjects => {
                  featuresProjects.popupTemplate = csgTemplate;
                  return featuresProjects;
              });
              const projectName = featuresProjects.map(featuresProjects => {
              return featuresProjects.attributes.Deal_Name;
              });
//              console.log(projectAttributes);
//              console.log(projectName);

              document.getElementById("result-list").innerHTML = "";
              document.getElementById("result-block").open = true;
              count = "("+featuresProjects.length+")";
              document.getElementById("result-block").setAttribute("summary", count);
              

              featuresProjects.forEach((result, index) => {
              const attributes = result.attributes;
              const item = document.createElement("calcite-list-item");
              const chip = document.createElement("calcite-chip");
              chip.value = attributes.SITE_COUNTY;
              chip.slot = "content-end";
              chip.scale = "s";
              chip.innerText = attributes.SITE_COUNTY;
              item.label = attributes.Deal_Name;
              item.value = index;
              item.description = attributes.Program;
              item.addEventListener("click", () => resultClickHandler(result, index));
              item.appendChild(chip);
              document.getElementById("result-list").appendChild(item);
              });

              
              function resultClickHandler(result, index) {
              const popup = featuresProjects && featuresProjects[parseInt(index, 10)];
              console.log(result);
              if (popup) {
                view.popup.open({
                  features: [popup],
                  location: result.geometry
                });
                view.goTo({ center: [result.geometry.longitude, result.geometry.latitude], zoom: 10 }, { duration: 400 });
              }
            }   
          });  
           return objectIds
          });
//         });
        } 
       })
       .catch(function(error) {
            console.log(error);
        });
      });
      
      
      let resultFeatures = [];
      setupCSV(); 
      
//////////// Export to CSV //////////////
  function setupCSV() {
      const btn = document.getElementById("btn-export");
//      console.log(resultFeatures);
      btn.addEventListener("click", () => {
          if (resultFeatures.length) {
              //export to csv
              const attrs = resultFeatures.map(a => a.attributes);
              const headers = {};
              const entry = attrs[0];
              for (let key in entry) {
                  if (entry.hasOwnProperty(key)) {
                      headers[key] = key;
                  }
              }
              exportCSVFile(headers, attrs, "Projects Adjacent to "+view.popup.title);
          }
      });
  }
  
  // export functions
  // https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
  function convertToCSV(objArray) {
    const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line != "") line += ",";

        line += array[i][index];
      }

      str += line + "\r\n";
    }

    return str;
  }

  function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    const csv = convertToCSV(jsonObject);

    const exportedFilenmae = fileTitle + ".csv" || "export.csv";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  console.log("BOTTOM OF REQUIRE");
});