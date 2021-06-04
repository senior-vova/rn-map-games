import React from "react";
import * as AmChartsCore from "@amcharts/amcharts4/core";
import * as AmChartsMaps from "@amcharts/amcharts4/maps";
import { ArmeniaGeodata } from "../../map-geodata";
import { Redirect } from "react-router-dom";
import { Modal } from "antd-mobile";

export class RegionsGamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      record: localStorage.getItem("region-record"),
      time: 0,
      regions: ArmeniaGeodata.features.map((v) => v.properties.name),
      findedRegions: [],
      findRegion: "",
      redirect: false,
      timer: null,
      showNewRecordModal: false,
      showFinishModal: false,
    };
  }

  componentDidMount() {
    this.getRandomRegion().then((region) => {
      this.setState({
        inGame: true,
        findRegion: region,
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
    chart.maxZoomLevel = 1.5;
    chart.seriesContainer.events.disableType("doublehit");
    chart.seriesContainer.background.events.disableType("hit");
    chart.chartContainer.background.events.disableType("doublehit");
    polygonSeries.useGeodata = true;
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.background.events.disableType("hit");
    polygonTemplate.fill = AmChartsCore.color("#ccc");
    polygonSeries.mapPolygons.template.events.on("hit", (event) =>
      this.regionHitEvent(event.target)
    );
  }

  getRandomRegion() {
    return new Promise((res, rej) => {
      const randomRegion =
        this.state.regions[
          Math.floor(Math.random() * this.state.regions.length)
        ];
      if (this.state.findedRegions.includes(randomRegion)) {
        res(this.getRandomRegion());
      }
      res(randomRegion);
    });
  }

  regionHitEvent(region) {
    const hitRegion = region.dataItem.dataContext.name;
    const { time } = this.state;
    if (hitRegion === this.state.findRegion) {
      region.fill = AmChartsCore.color("#367B25");
      this.setState({
        findedRegions: [...this.state.findedRegions, this.state.findRegion],
      });
      if (this.state.findedRegions.length === this.state.regions.length) {
        clearInterval(this.state.timer);
        const { record } = this.state;
        if (!record || time < record) {
          localStorage.setItem("region-record", time);
          this.setState({ showNewRecordModal: true });
        } else {
          this.setState({ showFinishModal: true });
        }
      } else {
        this.getRandomRegion().then((reg) =>
          this.setState({ findRegion: reg })
        );
      }
    } else {
      if (this.state.findedRegions.includes(hitRegion)) {
        region.fill = AmChartsCore.color("red");
        setTimeout(() => {
          region.fill = AmChartsCore.color("#367B25");
          setTimeout(() => {
            region.fill = AmChartsCore.color("red");
            setTimeout(() => {
              region.fill = AmChartsCore.color("#367B25");
            }, 300);
          }, 300);
        }, 400);
      } else {
        region.fill = AmChartsCore.color("red");
        setTimeout(() => {
          region.fill = AmChartsCore.color("#ccc");
          setTimeout(() => {
            region.fill = AmChartsCore.color("red");
            setTimeout(() => {
              region.fill = AmChartsCore.color("#ccc");
            }, 300);
          }, 300);
        }, 400);
      }
    }
  }

  render() {
    return (
      <>
        {this.state.redirect && <Redirect to={"/regions"} />}
        <div className="head" style={{ padding: 10 }}>
          <p style={{ fontSize: 16, fontWeight: "bold" }}>
            {this.state.time} վայրկյան
          </p>
          <p className="gteq">
            Գտեք{" "}
            <p style={{ fontWeight: "bold", display: "inline" }}>
              {this.state.findRegion}
              {this.state.findRegion[this.state.findRegion.length - 1] !== "ի"
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
