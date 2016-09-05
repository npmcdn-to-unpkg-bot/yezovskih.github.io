'use strict'

angular.module('myApp').directive('leafletMap', ['leafletService', '$document', function(leafletService, $document) {
    return {
        restrict: "EA",
        require: '^ngModel',
        scope: {
            ngModel: "="
        },
        templateUrl: 'public/assets/partials/leafletMap.html',
        replace: true,
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            this.showModal = false;

            this.markers = [];
            this.polyline = null;
            this.map = L.map('leaflet-map').setView([50.4501, 30.5234], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(this.map);

            this.selectedPoint = {index: null, lat: null, lng: null, alt: null, marker: null};

            var documentClickHandler = (function(e) {
                var modal = $element[0].querySelector('.map-modal');
                if (modal && !modal.contains(e.target)) {
                    this.closeMapModalHandler();
                    $scope.$apply();
                    $document.off('click', documentClickHandler);
                }
            }).bind(this);

            var pointClickHandler = (function (e) {
                var latlng = e.latlng,
                    marker = leafletService.createMarker(this.map, this.markers, latlng);

                var clickMarkerHandler = (function(e){
                    e.originalEvent.stopPropagation();

                    var ind = parseInt(e.target._icon.querySelector('div').dataset.index);
                    var pos = this.markers[ind].getLatLng();

                    this.selectedPoint.index = ind + 1;
                    this.selectedPoint.marker = this.markers[ind];
                    this.selectedPoint.lat = pos.lat;
                    this.selectedPoint.lng = pos.lng;
                    this.selectedPoint.alt = pos.alt;

                    this.showModal = true;

                    $scope.$apply();
                    $document.on('click', documentClickHandler);
                }).bind(this);

                var dragendMarkerHandler = (function(e) {
                    var alt = marker._latlng.alt;
                    var pos = {lat: e.target._latlng.lat, lng: e.target._latlng.lng};
                    if(alt !== undefined) pos.alt = alt;

                    marker.setLatLng(pos);

                    this.polyline = leafletService.renderPolyline(this.polyline, this.markers, this.map);
                    this.ngModel = this.markers.map(function(m){ return m._latlng});
                }).bind(this);

                marker.on('dragend', dragendMarkerHandler);
                marker.on('click', clickMarkerHandler);

                this.polyline = leafletService.renderPolyline(this.polyline, this.markers, this.map);

                this.ngModel = this.markers.map(function(m){ return m._latlng});
            }).bind(this);

            this.map.on('click', pointClickHandler);

            this.deleteMarker = function(e) {
                var ind = -1;

                for(var i = 0; i < this.markers.length; i++){
                    if(this.selectedPoint.marker === this.markers[i]) {
                        ind = i;
                        break;
                    }
                }

                // remove from array and render polyline
                if(ind !== -1) {
                    leafletService.removeAllMarkersFromMap(this.map, this.markers);
                    this.markers.splice(ind, 1);
                    leafletService.renderAllMarkersOnMap(this.map, this.markers);
                    this.polyline = leafletService.renderPolyline(this.polyline, this.markers, this.map);

                    this.ngModel = this.markers.map(function(m){ return m._latlng});
                }

                this.showModal = false;
            }

            this.submitEditMarkerHandler = function() {
                var ind = -1;
                var newInd = parseInt(this.selectedPoint.index) - 1;
                var latlng = {
                    lat: parseFloat(this.selectedPoint.lat),
                    lng: parseFloat(this.selectedPoint.lng)
                };
                if(this.selectedPoint.alt !== undefined) latlng.alt = parseFloat(this.selectedPoint.alt);

                if(newInd > this.markers.length - 1) newInd = this.markers.length - 1;

                for(var i = 0; i < this.markers.length; i++){
                    if(this.markers[i] === this.selectedPoint.marker){
                        ind = i;
                        break;
                    }
                }

                if(ind !== newInd){
                    var m1 = this.markers.splice(ind, 1)[0];
                    var m2 = this.markers.splice(newInd, 1, m1)[0];
                    this.markers.splice(ind, 0, m2);

                    for(var i = 0; i < this.markers.length; i++){
                        var html = this.markers[i]._icon.querySelector('div');
                        html.dataset.index = i;
                        html.innerHTML = i+1;
                    }
                }

                this.selectedPoint.marker.setLatLng(latlng);

                this.polyline = leafletService.renderPolyline(this.polyline, this.markers, this.map);

                this.ngModel = this.markers.map(function(m){ return m._latlng});

                this.closeMapModalHandler();
            }

            this.closeMapModalHandler = function() {
                this.showModal = false;
                this.selectedPoint = {index: null, lat: null, lng: null, alt: null, marker: null};
                $document.off('click', documentClickHandler);
            }

            $scope.$on('destroy', function(){
                $document.off('click', documentClickHandler);
            });
        }],
        controllerAs: 'lm',
        bindToController: true
    }
}])
