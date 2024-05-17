import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { useEffect } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import { Coordinate } from "openlayers";
import { useGeographic } from "ol/proj";

type MapProps = {
  center: Coordinate;
  zoom: number;
};

function MapComponent(props: MapProps) {
  useGeographic();
  useEffect(() => {
    const mapLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });
    mapLayer.on("prerender", (evt) => {
      // return
      if (evt.context) {
        const context = evt.context as CanvasRenderingContext2D;
        context.filter = "grayscale(80%) invert(100%) ";
        context.globalCompositeOperation = "source-over";
      }
    });

    mapLayer.on("postrender", (evt) => {
      if (evt.context) {
        const context = evt.context as CanvasRenderingContext2D;
        context.filter = "none";
      }
    });
    const layer_cloud = new TileLayer({
      source: new XYZ({
        url: `/map/clouds_new/{z}/{x}/{y}`,
      }),
    });
    const map = new Map({
      target: "map",
      layers: [mapLayer],
      view: new View({
        center: props.center,
        zoom: props.zoom,
      }),
    });
    map.addLayer(layer_cloud);
    return () => map.setTarget(undefined);
  }, []);
  return (
    <div
      style={{ height: "400px", width: "100%" }}
      id="map"
      className={`map-container`}
    ></div>
  );
}

export default MapComponent;
