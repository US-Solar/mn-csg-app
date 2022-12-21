  require([
     "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/widgets/Home",
      "esri/popup/content/TextContent",
      "esri/widgets/Expand"
    ], function (esriConfig,Map, MapView, FeatureLayer, Legend, Search, Home, TextContent,Expand) {
 
  // Web Map on AGOL link: https://us-solar.maps.arcgis.com/home/item.html?id=8468f4f6ce3c4151883eab89b2020935      
  const webmapId = new URLSearchParams(window.location.search).get("webmap") ?? "8468f4f6ce3c4151883eab89b2020935"; 

      
  // Arcade Script written in html will be used in popup template
  const arcadeScript = document.getElementById("projects-arcade").text;
      
  ///////////// STYLING AND LABELS /////////////////////////////////////////////
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
      
  // CSG Label info
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

  /////////////////// END STYLING AND LABELS///////////////////////////////////////
      
  /////////////////// POPUP TEMPLATES ////////////////////////////////////////////
      
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
   
  /////////////////// END POPUP TEMPLATES ////////////////////////////////////////////      
      
  /////////////////// FEATURE LAYERS //////////////////////////////////////////////      
        
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
      
   const csgLayer = new FeatureLayer({
      url: "https://services5.arcgis.com/V5xqUDxoOJurLR4H/arcgis/rest/services/MN_USS_Sites_Won_Centroids/FeatureServer/0",
      renderer: csgRenderer,
      labelingInfo: [csgLabels],
      legendEnabled: true,
      title: "MN USS CSG Sites Won",
      spatialReference: {wkid: 3857},
      popupTemplate: csgTemplate
  });
      
  /////////////////// END FEATURE LAYERS //////////////////////////////////////////////            
      
  //Create the map
  const map = new Map({
      basemap: "arcgis-topographic", // Basemap layer
       portalItem: {
          id: webmapId
        },
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
   
  // Legend Wdiget      
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
      
  // Home button widget
  const home = new Home({
      view: view
  });

  // Add search widget
  view.ui.add(searchWidget, {position: "top-right"});

  // Add legend widget
  view.ui.add(legend, "bottom-left");

  //Add Home button widget
  view.ui.add(home, "top-left")
  
      
  /////////////////////// QUERY PROJECTS WHEN COUNTY IS CLICKED //////////////////////////////////////
  let highlight;
      
  // Event trigger when the view is clicked    
  view.on("pointer-down", (event) => { 
    
    const opts = {
          include: counties
      }
//      console.log(event);
    // Return features from the counties layer that intersect the screen coordinates clicked
    // Documentation for hitTest: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#hitTest
    view.hitTest(event, opts).then((response) => {
        
      // response is Coordinates and the geometry of the clicked couny    
      console.log(response);
        
      // Check that there is a county response 
      if(response.results.length) {
          
          // Set graphic to the county graphic response
          const graphic = response.results[0].graphic;
          // Geometry of the county
          const geom = graphic.geometry;

          //Attempt to fix the query issue by zooming in before querying....    
          //only works when you click a second time....
          
          // Zoom to the center of the clicked county
          // Documentation for goTo: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html#goTo
          view.goTo({
              center: [geom.centroid.longitude, geom.centroid.latitude], zoom: 9
          })
              console.log([geom.centroid.longitude, geom.centroid.latitude]);
              console.log(geom);
              console.log(graphic);

              console.log(graphic.layer);
          
             // Get the LayerView created on the view for the county layer, then resolves a promise when the layer view for counties is created
             // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html#whenLayerView
             view.whenLayerView(graphic.layer).then(function(layerView){
                 
                  // Set up query for all counties that intersect the geometry of the clicked county
                  const query = counties.createQuery();
                  query.set({
                      geometry: geom,
                      spatialRelationship: "intersects",
                      returnGeometry: true,
                      returnQueryGeometry: true,
                      orderByFields: ["NAME DESC"]
                  });
                 
                 // Execute query
                  counties.queryFeatures(query).then((featureSet) => {
                      const features = featureSet.features;
    //                  const county = features.attributes.AttributesConstructor
    //                  console.log(features);
                      // Return attributes constructor of intersecting counties
                      const countyAttributes = features.map(feature => {
                          return feature.attributes;
                      });
                      console.log(countyAttributes);
    //                  console.log(features);
                      
                  // Highlight the queried counties or remove highlight if exists    
                  if (highlight) {
                      highlight.remove();
                  }
                  highlight = layerView.highlight(features);

                  // Get list of County Names                  
                  let output = [];
                  let outputPopup = [];
                  
                  // Loop through returned counties and create list of names for the popup     
                  for(var i = countyAttributes.length - 1; i >= 0; i --) {
                      outputPopup.push(countyAttributes[i].NAME);
                      output.push("'"+countyAttributes[i].NAME+"'");
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
              // Where the project county is in the list of county names          
              projectQuery.where = "SITE_COUNTY IN " + "(" + output.join(', ') + ")"; 

              // Execute query     
              csgLayer.queryFeatures(projectQuery).then((Ids) => {
                  const featuresProjects = Ids.features;
                  resultFeatures = featuresProjects;
                  console.log(Ids);
                  // Get project attributes
                  const projectAttributes = featuresProjects.map(featuresProjects => {
                      featuresProjects.popupTemplate = csgTemplate;
                      return featuresProjects;
                  });
                  // Get project Names
                  const projectName = featuresProjects.map(featuresProjects => {
                  return featuresProjects.attributes.Deal_Name;
                  });
    //              console.log(projectAttributes);
    //              console.log(projectName);
                  
                  // Used this tutorial: https://developers.arcgis.com/calcite-design-system/tutorials/apply-core-concepts/
                  // Set up the html to get ready to list result names
                  document.getElementById("result-list").innerHTML = "";
                  document.getElementById("result-block").open = true;
                  count = "("+featuresProjects.length+")"; // To display the count of results
                  document.getElementById("result-block").setAttribute("summary", count);

                  // For each project returned by the query
                  featuresProjects.forEach((result, index) => {
                      const attributes = result.attributes;
                      const item = document.createElement("calcite-list-item");
                      const chip = document.createElement("calcite-chip");
                      chip.value = attributes.SITE_COUNTY; // Calcite chip displays the county name
                      chip.slot = "content-end";
                      chip.scale = "s"; //Size small
                      chip.innerText = attributes.SITE_COUNTY;
                      item.label = attributes.Deal_Name; // List item is the deal name
                      item.value = index;
                      item.description = attributes.Program;
                      item.addEventListener("click", () => resultClickHandler(result, index)); // Event listener on item
                      item.appendChild(chip); // Add chip to the item
                      document.getElementById("result-list").appendChild(item); // display item in the result list
                  });

                  // When an item in the results list is clicked
                  function resultClickHandler(result, index) {
                      // Popup is the project feature popup
                      const popup = featuresProjects && featuresProjects[parseInt(index, 10)];
                      console.log(result);
                      // Open the popup 
                      if (popup) {
                        view.popup.open({
                          features: [popup],
                          location: result.geometry
                        });
                        // And zoom to the feature  
                        view.goTo({ center: [result.geometry.longitude, result.geometry.latitude], zoom: 10 }, { duration: 400 });
                      }
                }   
              });  
               return objectIds
              });
             });
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
      
  /////////////////////// Filter Program Type /////////////////////
  // Example Code: https://developers.arcgis.com/javascript/latest/sample-code/featurefilter-attributes/
      
  let programLayerView;
  const programNodes = document.querySelectorAll(`.program-item`);
  const programElement = document.getElementById("program-filter");    
      
  // click event handler for program choices      
  programElement.addEventListener("click", filterByProgram);    
      
  // User clicked on one of the programs in the filter dropdown
  // Set an attribute filter on csg layer view to display the projects in that program
  function filterByProgram(event) {
      const selectedProgram = event.target.getAttribute("data-program");
      programLayerView.filter = {
          where: "Program = '" + selectedProgram +"'"
      };
  }
      
  view.whenLayerView(csgLayer).then((layerView) => {
      // csg layer loaded
      // get a refernce to the csg layer view
      programLayerView = layerView;
      
      //set up ui
      programElement.style.visibility = "visible";
      const programExpand = new Expand ({
          view: view,
          content: programElement,
          expandIconClass: "esri-icon-filter",
          group: "top-left"
      });
      //clear filters when expand is closed
      programExpand.watch("expanded", () => {
          if (!programExpand.expanded) {
              programLayerView.filter = null;
          }
      });
      view.ui.add(programExpand, "top-left");
  });
});