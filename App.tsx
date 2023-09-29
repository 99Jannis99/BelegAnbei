import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import Drawer from "./Components/Navigation/Drawer";

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Drawer></Drawer>
    </NavigationContainer>
  );
}
export default App;
