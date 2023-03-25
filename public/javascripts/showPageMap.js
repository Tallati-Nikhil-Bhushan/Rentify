mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center:product.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());


  new mapboxgl.Marker()
    .setLngLat(product.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset:25})
      .setHTML(
        `<h3>${product.title}</h3><p>${product.location}</p>`
    )
    )
    .addTo(map)