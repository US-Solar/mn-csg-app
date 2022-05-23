<!DOCTYPE html>
<html>
<head>
  <title>Coronavirus</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body, #viewDiv {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    #labelDiv {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 30px;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      font-family: 'Courier New', Courier, monospace;
      font-size: 25px;
      text-align: center;
      white-space: pre;
    }
  </style>
  <link rel="stylesheet" href="https://js.arcgis.com/4.18/esri/themes/dark/main.css" />
  <script src="https://js.arcgis.com/4.18/"></script>
  <script type="text/javascript">
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer"
    ], function (
      Map,
      MapView,
      FeatureLayer
    ) {
      (async () => {
        const url = "https://services9.arcgis.com/N9p5hsImWXAccRNI/ArcGIS/rest/services/Nc2JKvYFoAEOFCG5JSI6/FeatureServer/1";
      
        const featureLayer = new FeatureLayer({
          url,
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-marker",
              size: 4,
              color: "red",
              outline: null
            }
          },
          outFields: [
            "Deaths",
            "Confirmed"
          ]
        });

        const map = new Map({
          basemap: "dark-gray-vector",
          layers: [featureLayer]
        });

        const view = new MapView({
          container: "viewDiv",
          map,
          extent: {
            xmin: -125,
            ymin: 30,
            xmax: -59,
            ymax: 47
          },
          ui: {
            components: []
          }
        });

        const featureLayerView = await view.whenLayerView(featureLayer);

        /**
         * 1. Use featureLayerView.filter to only show features within 300km of cursor.
        */
        // view.on("pointer-move", (event) => {
        //   featureLayerView.filter = {
        //     geometry: view.toMap(event),
        //     spatialRelationship: "contains",
        //     distance: 300,
        //     units: "kilometers"
        //   };
        // });

        /**
         * 2. Use featureLayerView.effect to dim features beyound 300km radius of cursor.
        */
        // view.on("pointer-move", (event) => {
        //   featureLayerView.effect = {
        //     filter: {
        //       geometry: view.toMap(event),
        //       spatialRelationship: "contains",
        //       distance: 300,
        //       units: "kilometers"
        //     },
        //     excludedEffect: "opacity(30%)"
        //   };
        // });

        /**
         * 3. Use featureLayerView.effect to invert/glow features within 300km of cursor.
        */
        view.on("pointer-move", (event) => {
          featureLayerView.effect = {
            filter: {
              geometry: view.toMap(event),
              spatialRelationship: "contains",
              distance: 300,
              units: "kilometers"
            },
            includedEffect: "invert() bloom(1.5, 0.1px, 0)"
          };
        });

        /**
         * 4. Display the number of COVID cases and deaths.
        */
        view.on("pointer-move", async (event) => {
          const query = {
            geometry: view.toMap(event),
            spatialRelationship: "contains",
            distance: 300,
            units: "kilometers",
            outStatistics: [
              {
                onStatisticField: "Confirmed",
                outStatisticFieldName: "sum_of_cases",
                statisticType: "sum"
              },
              {
                onStatisticField: "Deaths",
                outStatisticFieldName: "sum_of_deaths",
                statisticType: "sum"
              }
            ]
          };
          const featureSet = await featureLayerView.queryFeatures(query);
          const {
            features: [{
              attributes: {
                sum_of_cases,
                sum_of_deaths
              }
            }
          ]} = featureSet;

          const formatter = new Intl.NumberFormat("en-us");
          const cases = formatter.format(sum_of_cases).padStart(9);
          const deaths = formatter.format(sum_of_deaths).padStart(7);

          const label = `Cases: ${cases} - Deaths: ${deaths}`;

          document.getElementById("labelDiv").innerText = label;
        });
      })();
    });
  </script>
</head>
<body>
  <div id="viewDiv"></div>
  <div id="labelDiv"></div>
</body>
</html>