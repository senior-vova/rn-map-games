import React, { useState, useEffect } from "react";
import * as AmChartsCore from "@amcharts/amcharts4/core";
import * as AmChartsMaps from "@amcharts/amcharts4/maps";
import { ArmeniaGeodata } from "../../map-geodata";
import { NavLink } from "react-router-dom";

export const CitiesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const record = localStorage.getItem("cities-record");

  useEffect(() => {
    AmChartsCore.options.autoDispose = true;
    const chart = AmChartsCore.create("map", AmChartsMaps.MapChart);
    chart.geodata = ArmeniaGeodata;
    chart.projection = new AmChartsMaps.projections.Miller();
    const polygonSeries = chart.series.push(
      new AmChartsMaps.MapPolygonSeries()
    );
    // chart.chartContainer.resizable = false;
    // chart.panBehavior = "none";
    chart.maxZoomLevel = 2;
    chart.seriesContainer.events.disableType("doublehit");
    chart.seriesContainer.background.events.disableType("hit");
    chart.chartContainer.background.events.disableType("doublehit");
    polygonSeries.useGeodata = true;
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.background.events.disableType("hit");
    // polygonTemplate.tooltipText = "{name}";
    // polygonTemplate.fill = AmChartsCore.color("#ccc");
    // const hs = polygonTemplate.states.create("hover");
    // hs.properties.fill = AmChartsCore.color("#367B25");
    const imageSeries = chart.series.push(new AmChartsMaps.MapImageSeries());
    const imageSeriesTemplate = imageSeries.mapImages.template;
    const circle = imageSeriesTemplate.createChild(AmChartsCore.Circle);
    circle.radius = 10;
    circle.fill = AmChartsCore.color("#B27799");
    circle.stroke = AmChartsCore.color("#FFFFFF");
    circle.strokeWidth = 2;
    circle.nonScaling = true;
    circle.tooltipText = "{title}";
    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";
    imageSeries.data = [
      {
        latitude: 40.17,
        longitude: 44.53,
        title: "Երևան",
      },
      {
        latitude: 40.784339,
        longitude: 43.8053866,
        title: "Գյումրի",
      },
      {
        latitude: 40.1590191,
        longitude: 44.0250491,
        title: "Արմավիր",
      },
      {
        latitude: 40.2912664,
        longitude: 44.3237611,
        title: "Աշտարակ",
      },
      {
        latitude: 40.8159379,
        longitude: 44.4399114,
        title: "Վանաձոր",
      },
      {
        latitude: 40.8895606,
        longitude: 45.1342821,
        title: "Իջևան",
      },
      {
        latitude: 40.3545493,
        longitude: 45.1195619,
        title: "Գավառ",
      },
      {
        latitude: 40.539603,
        longitude: 44.6951277,
        title: "Հրազդան",
      },
      {
        latitude: 39.9541245,
        longitude: 44.5303558,
        title: "Արտաշատ",
      },
      {
        latitude: 39.7629995,
        longitude: 45.3252124,
        title: "Եղեգնաձոր",
      },
      {
        latitude: 39.2119919,
        longitude: 46.3316841,
        title: "Կապան",
      },
    ];
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="head">
        <p style={{ fontSize: 16, fontWeight: "bold" }}>
          Ռեկորդ: {record ? `${record}վրկ` : "չկա"}
        </p>
        <NavLink
          className={
            "am-button am-button-ghost am-button-small am-button-inline"
          }
          style={{ fontSize: 16, fontWeight: "bold" }}
          to="/cities/play"
        >
          Խաղալ
        </NavLink>
      </div>
      {isLoading && <div className="load">Loading...</div>}
      <div id="map"></div>
    </>
  );
};
