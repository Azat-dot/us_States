import L from "leaflet";
import "leaflet-search";
import "leaflet-search/dist/leaflet-search.min.css";
import states from "./states";

var mapOptions = {
  center: [37.975000009, -96.271],
  zoom: 4
};

var map = L.map("leafletMapid", mapOptions);

var baselayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
    maxZoom: 9
  }
);

baselayer.addTo(map);

var featuresLayer = new L.GeoJSON(states, {
  style: function (feature) {
    return { geometry: feature.properties.name };
  },
  onEachFeature: function (feature, marker) {
    marker.bindPopup(
      "<h4>" +
        "<h4>" +
        feature.properties.name +
        "</h4>" +
        "<br>" +
        "Дата основания: " +
        feature.properties.foundation +
        "<br>" +
        feature.properties.capital +
        " - " +
        "центр штата " +
        feature.properties.name +
        "</h4>"
    );
  }
});

map.addLayer(featuresLayer);

var searchControl = new L.Control.Search({
  layer: featuresLayer,
  propertyName: "name",
  marker: false,
  position: "topright",
  moveToLocation: function (latlng, title, map) {
    var zoom = map.getBoundsZoom(latlng.layer.getBounds());
    map.setView(latlng, zoom);
  }
});

searchControl
  .on("search:locationfound", function (e) {
    e.layer.setStyle({ fillColor: "#3f0", color: "#0f0" });
    if (e.layer._popup) e.layer.openPopup();
  })
  .on("search:collapsed", function (e) {
    featuresLayer.eachLayer(function (layer) {
      featuresLayer.resetStyle(layer);
    });
  });

map.addControl(searchControl);
