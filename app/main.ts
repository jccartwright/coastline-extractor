import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import Sketch = require("esri/widgets/Sketch");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Graphic = require("esri/Graphic");
import Extent = require("esri/geometry/Extent");
import webMercatorUtils = require("esri/geometry/support/webMercatorUtils");
import { Point } from "esri/geometry";


let extentGraphic: Graphic = null;

const layer = new GraphicsLayer();

const map = new EsriMap({
  basemap: "streets",
  layers: [layer]
});
  
const mapView = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118.244, 34.052],
  zoom: 5
});

mapView.when(function() {
    // const sketch = new Sketch({
    //     layer: layer,
    //     view: mapView
    // });
    // mapView.ui.add(sketch, "top-right");
});

let drawExtentBtnHandler = function() {
  if (extentGraphic) { mapView.graphics.remove(extentGraphic) }
  _setDrawHandler();
};

document.getElementById('drawExtentBtn').onclick = drawExtentBtnHandler;

// Create a symbol for rendering the graphic
const fillSymbol = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: [227, 139, 79, 0.5],
  outline: { // autocasts as new SimpleLineSymbol()
    color: [255, 255, 255],
    width: 1
  }
};
  

let _setDrawHandler = function() {
  let origin:Point = null;

  // Thanks to Thomas Solow (https://community.esri.com/thread/203242-draw-a-rectangle-in-jsapi-4x)
  const handler = mapView.on('drag', e => {
    e.stopPropagation();
    if (e.action === 'start') {
      if (extentGraphic) { mapView.graphics.remove(extentGraphic) };
      origin = mapView.toMap(e);

    } else if (e.action === 'update') {
      //fires continuously during drag
      if (extentGraphic) { mapView.graphics.remove(extentGraphic) };
      let p = mapView.toMap(e); 
      extentGraphic = new Graphic({
        geometry: new Extent({
          xmin: Math.min(p.x, origin.x),
          xmax: Math.max(p.x, origin.x),
          ymin: Math.min(p.y, origin.y),
          ymax: Math.max(p.y, origin.y),
          spatialReference: { wkid: 102100 }
        }),
        symbol: fillSymbol
      }),
      mapView.graphics.add(extentGraphic)

    } else if (e.action === 'end') { 
      let {xmin, ymin, xmax, ymax} = webMercatorUtils.webMercatorToGeographic(extentGraphic.geometry) as Extent;
      console.log(xmin, ymin, xmax, ymax);

      // remove the handler so map panning will work when not drawing
      handler.remove();
    }
  });
  return handler;
}