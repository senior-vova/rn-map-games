import React, { useState, useEffect } from "react";
import * as AmChartsCore from "@amcharts/amcharts4/core";
import * as AmChartsMaps from "@amcharts/amcharts4/maps";
import { ArmeniaGeodata } from "../../map-geodata";
import { NavLink } from "react-router-dom";
import { CitiesData } from "./data";

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
    circle.radius = 12;
    circle.fill = AmChartsCore.color("#B27799");
    circle.stroke = AmChartsCore.color("#FFFFFF");
    circle.strokeWidth = 2;
    circle.nonScaling = true;
    circle.tooltipHTML = "<h3>{title}</h3>";
    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";
    imageSeries.data = CitiesData;
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
