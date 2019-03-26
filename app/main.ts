import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import Sketch = require("esri/widgets/Sketch");
import GraphicsLayer = require("esri/layers/GraphicsLayer");


const layer = new GraphicsLayer();

const map = new EsriMap({
    basemap: "streets",
    layers: [layer]
  });
  
const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118.244, 34.052],
  zoom: 5
});

view.when(function() {
    const sketch = new Sketch({
        layer: layer,
        view: view
    });
    view.ui.add(sketch, "top-right");
});
