// import React, { useState, useEffect } from "react";
import React from "react";
import * as AmChartsCore from "@amcharts/amcharts4/core";
import * as AmChartsMaps from "@amcharts/amcharts4/maps";
import { ArmeniaGeodata } from "../../map-geodata";
import { Redirect } from "react-router-dom";

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
    };
  }

  componentDidMount() {
    this.getRandomRegion().then((region) => {
      this.setState({
        ...this.state,
        inGame: true,
        findRegion: region,
      });
      this.createMap();
      this.setState({
        ...this.state,
        isLoading: false,
        time: 1,
      });
      this.setState({
        ...this.state,
        timer: setInterval(() => {
          this.setState({ ...this.state, time: this.state.time + 1 });
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
    chart.chartContainer.resizable = false;
    chart.panBehavior = "none";
    chart.maxZoomLevel = 1;
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
    const time = this.state.time;
    if (hitRegion === this.state.findRegion) {
      region.fill = AmChartsCore.color("#367B25");
      this.setState({
        ...this.state,
        findedRegions: [...this.state.findedRegions, this.state.findRegion],
      });
      if (this.state.findedRegions.length === this.state.regions.length) {
        this.setState({ ...this.state, redirect: true });
        const { record } = this.state;
        if (!record || time < record) {
          localStorage.setItem("region-record", time);
          alert(
            "Congrats. You're time is " + time + "seconds. New record: " + time
          );
        } else {
          alert("Congrats. You're time is " + time + "seconds");
        }
      } else {
        this.getRandomRegion().then((reg) =>
          this.setState({ ...this.state, findRegion: reg })
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
        <div className="head">
          <p>{this.state.time} վայրկյան</p>
          <p>
            Գտեք {this.state.findRegion}
            {this.state.findRegion[this.state.findRegion.length - 1] !== "ի"
              ? "ը"
              : "ն"}
          </p>
        </div>
        {this.state.isLoading && <div className="load">Loading...</div>}
        <div id="mapgame"></div>
      </>
    );
  }
}

// export function RegionsGamePage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const record = localStorage.getItem("region-record");
//   const [time, setTime] = useState(0);
//   const regions = ArmeniaGeodata.features.map((v) => v.properties.name);
//   const [findedRegions, setFindedRegions] = useState([]);
//   const [findRegion, setFindRegion] = useState("");
//   const [redirect, setRedirect] = useState(false);

//   useEffect(() => {
//     getRandomRegion().then((region) => {
//       setFindRegion(region);
//       CreateMap();
//       setIsLoading(false);
//       setTime(1);
//     });
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     setTimeout(() => setTime(time + 1), 1000);
//   }, [time]);

//   function CreateMap() {
//     const chart = AmChartsCore.create("mapgame", AmChartsMaps.MapChart);
//     chart.geodata = ArmeniaGeodata;
//     chart.projection = new AmChartsMaps.projections.Miller();
//     const polygonSeries = chart.series.push(
//       new AmChartsMaps.MapPolygonSeries()
//     );
//     chart.chartContainer.resizable = false;
//     chart.panBehavior = "none";
//     chart.maxZoomLevel = 1;
//     chart.seriesContainer.events.disableType("doublehit");
//     chart.seriesContainer.background.events.disableType("hit");
//     chart.chartContainer.background.events.disableType("doublehit");
//     polygonSeries.useGeodata = true;
//     const polygonTemplate = polygonSeries.mapPolygons.template;
//     polygonTemplate.background.events.disableType("hit");
//     polygonTemplate.fill = AmChartsCore.color("#ccc");
//     polygonTemplate.events.on("hit", (event) => {
//       regionHitEvent(event.target);
//     });
//   }

//   function getRandomRegion() {
//     return new Promise((res, rej) => {
//       const randomRegion = regions[Math.floor(Math.random() * regions.length)];
//       if (findedRegions.includes(randomRegion)) {
//         res(getRandomRegion());
//       }
//       res(randomRegion);
//     });
//   }

//   function regionHitEvent(region) {
//     const hitRegion = region.dataItem.dataContext.name;
//     alert(`Find: ${findRegion}, Time: ${time}`);
//     if (hitRegion === findRegion) {
//       region.fill = AmChartsCore.color("#367B25");
//       setFindedRegions([...findedRegions, findRegion]);
//       if (findedRegions.length === regions.length) {
//         if (!record || record < time) {
//           localStorage.setItem("region-record", time);
//           alert(
//             "Congrats. You're time is " + time + "seconds. New record: " + time
//           );
//         } else {
//           alert("Congrats. You're time is " + time + "seconds");
//         }
//         setRedirect(true);
//       } else {
//         getRandomRegion().then((reg) => setFindRegion(reg));
//       }
//     } else {
//       if (findedRegions.includes(hitRegion)) {
//         region.fill = AmChartsCore.color("red");
//         setTimeout(() => {
//           region.fill = AmChartsCore.color("#367B25");
//           setTimeout(() => {
//             region.fill = AmChartsCore.color("red");
//             setTimeout(() => {
//               region.fill = AmChartsCore.color("#367B25");
//             }, 300);
//           }, 300);
//         }, 400);
//       } else {
//         region.fill = AmChartsCore.color("red");
//         setTimeout(() => {
//           region.fill = AmChartsCore.color("#ccc");
//           setTimeout(() => {
//             region.fill = AmChartsCore.color("red");
//             setTimeout(() => {
//               region.fill = AmChartsCore.color("#ccc");
//             }, 300);
//           }, 300);
//         }, 400);
//       }
//     }
//   }

//   return (
//     <>
//       {redirect && <Redirect to="/regions" />}
//       <div className="head">
//         <p>{time} վայրկյան</p>
//         <p>
//           Գտեք{" "}
//           <b>
//             {findRegion}
//             {findRegion[findRegion.length - 1] !== "ի" ? "ը" : "ն"}
//           </b>
//         </p>
//       </div>
//       {isLoading && <div className="load">Loading...</div>}
//       <div id="mapgame"></div>
//     </>
//   );
// }
