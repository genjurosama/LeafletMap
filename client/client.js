// create marker collection
Markers = new Meteor.Collection('markers');

Meteor.subscribe('markers');

Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/leaflet/images';

  var map = L.map('map', {
    doubleClickZoom: false
  }).setView([49.25044, -123.137], 13);

  L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

  map.on('dblclick', function(event) {
    var marker = L.marker(event.latlng);
    var popup = L.popup()
    .setLatLng(event.latlng)
    .setContent("I am a standalone <b>popup.</b></br><input type='text' class='form-control' />")
    .openOn(map);
    console.log("marker:"+marker.getLatLng());
    Markers.insert({latlng: marker.getLatLng()});
    
  });

  var query = Markers.find();
  query.observe({
    added: function(document) {
      var marker = L.marker(document.latlng).addTo(map).bindPopup("<b>create a place</b><br><input type='text' class='form-control'/>").openPopup();
       marker.on('dblclick', function(event) {
          map.removeLayer(marker);
          Markers.remove({_id: document._id});
        });
    },
    removed: function(oldDocument) {
      layers = map._layers;
      var key, val;
      for (key in layers) {
        val = layers[key];
        if (val._latlng) {
          if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
            map.removeLayer(val);
          }
        }
      }
    }
  });
};
