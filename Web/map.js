function initMap() {
  window.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 52.953350, lng: -1.150350},
    zoom: 19,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
}

var pusher = new Pusher('90328f0186c7537be223', {
      cluster: 'eu',
      encrypted: true
    });

var channel = pusher.subscribe("bite");

channel.bind('player-moved', function(data) {
  var lat = data.lat;
  var lng  = data.lng;

  var marker = new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: map
  });

});


  