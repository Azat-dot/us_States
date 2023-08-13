import L from "leaflet";
import "leaflet-search";
import "leaflet-search/dist/leaflet-search.min.css";
import states from "./states";

let mapOptions = {
  center: [40, -95],
  zoom: 4
};

let map = L.map("leafletMapid", mapOptions);

let baselayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }
);

baselayer.addTo(map);

let featuresLayer = new L.GeoJSON(states, {
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

let searchControl = new L.Control.Search({
  layer: featuresLayer,
  propertyName: "name",
  marker: false,
  position: "topright",
  moveToLocation: function (latlng, title, map) {
    let zoom = map.getBoundsZoom(latlng.layer.getBounds());
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
