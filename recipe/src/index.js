import React from "react";
import ReactDOM from "react-dom";
import Recipe from "./components/recipe/recipe.component";
import { Detector } from "react-detect-offline";

const App = () => {
  return (
    <Detector
    render={({ online }) => (
        <div>
          <Recipe onlineStatus={online} />
        </div>
      )}
    />
  );
};

ReactDOM.render(<App />, document.querySelector("#container"));