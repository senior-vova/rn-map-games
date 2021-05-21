import React from "react";
import "./App.css";
import { Redirect, Route, Switch } from "react-router";
import { RegionsPage } from "./pages/regions/regions";
import { RegionsGamePage } from "./pages/regions/regions-play";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/regions" render={() => <RegionsPage />} />
        <Route exact path="/regions/play" render={() => <RegionsGamePage />} />
        <Route path="/" render={() => <Redirect to="/regions" />} />
      </Switch>
    </div>
  );
}

export default App;