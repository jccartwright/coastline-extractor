define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/Extent", "esri/geometry/support/webMercatorUtils", "app/Recenter"], function (require, exports, EsriMap, MapView, GraphicsLayer, Graphic, Extent, webMercatorUtils, Recenter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var extentGraphic = null;
    var layer = new GraphicsLayer();
    var map = new EsriMap({
        basemap: "streets",
        layers: [layer]
    });
    var mapView = new MapView({
        map: map,
        container: "viewDiv",
        center: [-118.244, 34.052],
        zoom: 5
    });
    mapView.when(function () {
        // const sketch = new Sketch({
        //     layer: layer,
        //     view: mapView
        // });
        // mapView.ui.add(sketch, "top-right");
        var recenter = new Recenter_1.Recenter({
            view: mapView,
            initialCenter: [-100.33, 43.69]
        });
        mapView.ui.add(recenter, "top-right");
    });
    var drawExtentBtnHandler = function () {
        if (extentGraphic) {
            mapView.graphics.remove(extentGraphic);
        }
        _setDrawHandler();
    };
    document.getElementById('drawExtentBtn').onclick = drawExtentBtnHandler;
    // Create a symbol for rendering the graphic
    var fillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.5],
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    };
    var _setDrawHandler = function () {
        var origin = null;
        // Thanks to Thomas Solow (https://community.esri.com/thread/203242-draw-a-rectangle-in-jsapi-4x)
        var handler = mapView.on('drag', function (e) {
            e.stopPropagation();
            if (e.action === 'start') {
                if (extentGraphic) {
                    mapView.graphics.remove(extentGraphic);
                }
                ;
                origin = mapView.toMap(e);
            }
            else if (e.action === 'update') {
                //fires continuously during drag
                if (extentGraphic) {
                    mapView.graphics.remove(extentGraphic);
                }
                ;
                var p = mapView.toMap(e);
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
                    mapView.graphics.add(extentGraphic);
            }
            else if (e.action === 'end') {
                var _a = webMercatorUtils.webMercatorToGeographic(extentGraphic.geometry), xmin = _a.xmin, ymin = _a.ymin, xmax = _a.xmax, ymax = _a.ymax;
                console.log(xmin, ymin, xmax, ymax);
                // remove the handler so map panning will work when not drawing
                handler.remove();
            }
        });
        return handler;
    };
});
//# sourceMappingURL=main.js.map