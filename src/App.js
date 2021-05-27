import React from "react";
import "./App.css";
import "antd-mobile/dist/antd-mobile.css";
import { Redirect, Route, Switch } from "react-router";
import { RegionsPage } from "./pages/regions/regions";
import { RegionsGamePage } from "./pages/regions/regions-play";
import { MainAppHOC } from "./mainAppHoc";
import { CitiesPage } from "./pages/cities/cities";
import { CitiesGamePage } from "./pages/cities/cities-play";
import { PlacesPage } from "./pages/places/places";
import { PlacesGamePage } from "./pages/places/places-play";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/regions" render={() => <RegionsPage />} />
        <Route exact path="/regions/play" render={() => <RegionsGamePage />} />
        <Route exact path="/cities" render={() => <CitiesPage />} />
        <Route exact path="/cities/play" render={() => <CitiesGamePage />} />
        <Route exact path="/places" render={() => <PlacesPage />} />
        <Route exact path="/places/play" render={() => <PlacesGamePage />} />
        <Route path="/" render={() => <Redirect to="/regions" />} />
      </Switch>
    </div>
  );
}

export default MainAppHOC(App);
