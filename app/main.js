define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/widgets/Sketch", "esri/layers/GraphicsLayer"], function (require, exports, EsriMap, MapView, Sketch, GraphicsLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var layer = new GraphicsLayer();
    var map = new EsriMap({
        basemap: "streets",
        layers: [layer]
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-118.244, 34.052],
        zoom: 5
    });
    view.when(function () {
        var sketch = new Sketch({
            layer: layer,
            view: view
        });
        view.ui.add(sketch, "top-right");
    });
});
//# sourceMappingURL=main.js.map