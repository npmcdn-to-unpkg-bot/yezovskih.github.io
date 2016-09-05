angular.module('myApp').controller('leafletMapCtrl', ['$scope', '$http', function($scope, $http) {
    this.coordinates = [];

    this.submitRoute = function() {
        var data = this.coordinates;
        console.log(data)
        $http({
            method: 'POST',
            url: '/saveRouting',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).then(
            function success(res) {console.log(res)},
            function error(res){console.log(res)}
        )
    }

}])
