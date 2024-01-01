import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { Store } from "./src/redux/store";

import Drawer from "./src/Components/Navigation/Drawer";

const basicFontSize = 20;

function App(): React.JSX.Element {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Drawer></Drawer>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
