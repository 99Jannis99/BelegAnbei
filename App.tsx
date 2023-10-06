import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { Store } from "./redux/store";

import Drawer from "./Components/Navigation/Drawer";

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
