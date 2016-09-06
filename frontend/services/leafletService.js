'use strict'

angular.module('myApp').service('leafletService', function() {

    // map: leaflet map object
    this.removeAllMarkersFromMap = function(map, markers) {
        for(var i = 0; i < markers.length; i++) {
            map.removeLayer(markers[i]);
        }
    }

    // map: leaflet map object
    // markers: array of leaflet marker objects
    this.renderAllMarkersOnMap = function(map, markers){
        var arr = markers.map(function(m){ return m._latlng});

        markers.splice(0, markers.length);

        for(var i = 0; i < arr.length; i++) {
            this.createMarker(map, markers, arr[i]);
        }
    }

    // returns layerGroup with polylines and polyline decorators.
    this.drawPolyline = function(polyline, markers, map){
        var arr = markers.map(function(m){ return m._latlng}),
            polyline = this.removePolyline(polyline, map);

        if(arr.length > 1) {
            polyline = L.layerGroup();
            for (var i = 0; i < arr.length; i++) {
                if (i + 1 < arr.length) {
                    var p = L.polyline([arr[i], arr[i + 1]], {color: 'red'}).addTo(map);
                    var d = L.polylineDecorator(p, {
                        patterns: [
                            {
                                offset: '100%',
                                repeat: 0,
                                symbol: new L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: 'red'}})
                            }
                        ]
                    }).addTo(map);
                    polyline.addLayer(p);
                    polyline.addLayer(d);
                }
            }
        }

        return polyline;
    }

    // removes all layers from polyline(LayerGroup).
    this.removePolyline = function(polyline, map) {
        if(polyline) polyline.eachLayer(function(layer){
            map.removeLayer(layer);
        });
        return null;
    }

    // adds marker to map.
    // returns created leaflet marker object.
    this.createMarker = function(map, markers, latlng) {
        var icon = L.divIcon({className: 'leaflet-marker', html:'<div data-index="'+ markers.length +'">'+ (markers.length + 1) +'</div>'});
        var marker = L.marker([latlng.lat, latlng.lng],{icon: icon, draggable: true}).addTo(map);
        markers.push(marker);
        return marker;
    }

});

