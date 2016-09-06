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

    // returns new polyline
    this.renderPolyline = function(polyline, markers, map){
        var arr = markers.map(function(m){ return m._latlng});

        if(!polyline) {
            polyline = L.polyline(arr, {color: 'red'}).addTo(map);
        } else {
           polyline.setLatLngs(arr);
        }

        return polyline;
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

