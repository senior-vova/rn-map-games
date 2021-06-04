import React from "react";
import * as AmChartsCore from "@amcharts/amcharts4/core";
import * as AmChartsMaps from "@amcharts/amcharts4/maps";
import { ArmeniaGeodata } from "../../map-geodata";
import { Redirect } from "react-router-dom";
import { Modal } from "antd-mobile";
import { CitiesData } from "./data";

export class CitiesGamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      record: localStorage.getItem("cities-record"),
      time: 0,
      cities: CitiesData.map((v) => v.title),
      findedCities: [],
      findCity: "",
      redirect: false,
      timer: null,
      showNewRecordModal: false,
      showFinishModal: false,
    };
  }

  componentDidMount() {
    this.getRandomCity().then((city) => {
      this.setState({
        inGame: true,
        findCity: city,
      });
      this.createMap();
      this.setState({
        isLoading: false,
        time: 1,
      });
      this.setState({
        timer: setInterval(() => {
          this.setState({ time: this.state.time + 1 });
        }, 1000),
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  createMap() {
    AmChartsCore.options.autoDispose = true;
    const chart = AmChartsCore.create("mapgame", AmChartsMaps.MapChart);
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
    const imageSeries = chart.series.push(new AmChartsMaps.MapImageSeries());
    const imageSeriesTemplate = imageSeries.mapImages.template;
    const circle = imageSeriesTemplate.createChild(AmChartsCore.Circle);
    circle.radius = 13;
    circle.fill = AmChartsCore.color("#B27799");
    circle.stroke = AmChartsCore.color("#FFFFFF");
    circle.strokeWidth = 2;
    circle.nonScaling = true;
    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";
    imageSeries.data = CitiesData;
    imageSeries.mapImages.template.events.on("hit", (event) => {
      this.cityHitEvent(event.target);
    });
  }

  getRandomCity() {
    return new Promise((res, rej) => {
      const randomCity =
        this.state.cities[Math.floor(Math.random() * this.state.cities.length)];
      if (this.state.findedCities.includes(randomCity)) {
        res(this.getRandomCity());
      }
      res(randomCity);
    });
  }

  cityHitEvent(city) {
    const hitCity = city.dataItem.dataContext.title;
    const { time } = this.state;
    const circle = city._children._values[0];
    if (hitCity === this.state.findCity) {
      circle.fill = AmChartsCore.color("#367B25");
      this.setState({
        findedCities: [...this.state.findedCities, this.state.findCity],
      });
      if (this.state.findedCities.length === this.state.cities.length) {
        clearInterval(this.state.timer);
        const { record } = this.state;
        if (!record || time < record) {
          localStorage.setItem("cities-record", time);
          this.setState({ showNewRecordModal: true });
        } else {
          this.setState({ showFinishModal: true });
        }
      } else {
        this.getRandomCity().then((c) => this.setState({ findCity: c }));
      }
    } else {
      if (this.state.findedCities.includes(hitCity)) {
        circle.fill = AmChartsCore.color("red");
        setTimeout(() => {
          circle.fill = AmChartsCore.color("#367B25");
          setTimeout(() => {
            circle.fill = AmChartsCore.color("red");
            setTimeout(() => {
              circle.fill = AmChartsCore.color("#367B25");
            }, 300);
          }, 300);
        }, 400);
      } else {
        circle.fill = AmChartsCore.color("red");
        setTimeout(() => {
          circle.fill = AmChartsCore.color("#B27799");
          setTimeout(() => {
            circle.fill = AmChartsCore.color("red");
            setTimeout(() => {
              circle.fill = AmChartsCore.color("#B27799");
            }, 300);
          }, 300);
        }, 400);
      }
    }
  }

  render() {
    return (
      <>
        {this.state.redirect && <Redirect to={"/cities"} />}
        <div className="head" style={{ padding: 10 }}>
          <p style={{ fontSize: 16, fontWeight: "bold" }}>
            {this.state.time} վայրկյան
          </p>
          <p className="gteq">
            Գտեք{" "}
            <p style={{ fontWeight: "bold", display: "inline" }}>
              {this.state.findCity}
              {this.state.findCity[this.state.findCity.length - 1] !== "ի"
                ? "ը"
                : "ն"}
            </p>
          </p>
        </div>
        <Modal
          visible={this.state.showNewRecordModal}
          transparent
          maskClosable={false}
          onClose={() => this.setState({ showNewRecordModal: false })}
          title={`Շնորհավորում ենք ձեզ․ Ձեր նոր ռեկորդը՝ ${this.state.time}վրկ`}
          footer={[
            {
              text: "Ok",
              onPress: () => this.setState({ showNewRecordModal: false }),
            },
          ]}
          afterClose={() => this.setState({ redirect: true })}
        />
        <Modal
          visible={this.state.showFinishModal}
          transparent
          maskClosable={false}
          onClose={() => this.setState({ showFinishModal: false })}
          title={`Շնորհավորում ենք ձեզ․ Ձեր ժամանակը՝ ${this.state.time}վրկ`}
          footer={[
            {
              text: "Ok",
              onPress: () => this.setState({ showFinishModal: false }),
            },
          ]}
          afterClose={() => this.setState({ redirect: true })}
        />
        {this.state.isLoading && <div className="load">Loading...</div>}
        <div id="mapgame"></div>
      </>
    );
  }
}
