import React, { useState, useEffect } from "react";
import * as AmChartsCore from "@amcharts/amcharts4/core";
import * as AmChartsMaps from "@amcharts/amcharts4/maps";
import { ArmeniaGeodata } from "../../map-geodata";
import { NavLink } from "react-router-dom";

export const RegionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const record = localStorage.getItem("region-record");

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
    chart.maxZoomLevel = 1.6;
    chart.minZoomLevel = 0.9;
    chart.seriesContainer.events.disableType("doublehit");
    chart.seriesContainer.background.events.disableType("hit");
    chart.chartContainer.background.events.disableType("doublehit");
    polygonSeries.useGeodata = true;
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.background.events.disableType("hit");
    polygonTemplate.tooltipHTML = "<h3>{name}</h3>";
    polygonTemplate.fill = AmChartsCore.color("#ccc");
    const hs = polygonTemplate.states.create("hover");
    hs.properties.fill = AmChartsCore.color("#367B25");
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="head">
        <p className="desc">
          Այս խաղի ընթացքում ձեզ տրվելու է մի պատահական տեսարժան վայրի անուն և
          դուք պետք է նշեք այն քարտեզի վրա
        </p>
      </div>
      <div className="footer">
        <NavLink
          className={
            "am-button am-button-primary am-button-large am-button-inline xaxal"
          }
          to="/regions/play"
        >
          Խաղալ
        </NavLink>
        <p style={{ fontSize: 16, fontWeight: "bold" }}>
          Ռեկորդ: {record ? `${record}վրկ` : "չկա"}
        </p>
      </div>
      {isLoading && <div className="load">Loading...</div>}
      <div id="map"></div>
    </>
  );
};
