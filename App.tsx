import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { Store } from "./src/redux/store";
import {
  View,
  Text,
  Button,
  useWindowDimensions
} from "react-native";

import CustomText from "./src/Components/shared/CustomText";
import Drawer from "./src/Components/Navigation/Drawer";

const basicFontSize = 20;

function App(): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Drawer></Drawer>
      </NavigationContainer>
      {/* TOUR <View style={{width: width, height: height, position: "absolute", left: 0, top: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, .9)"}}>
        <CustomText textType="headline" style={{}}>Willkommen</CustomText>
        <CustomText fontType="medium" style={{marginBottom: 24, marginTop: 24}}>Möchten Sie eine kurze Tour durch die App machen um alle Funktionen zu entdecken?</CustomText>
        <Button title="Ja, Tour starten"></Button>
        <Button title="Nein, vielleicht später"></Button>
      </View>*/}
    </Provider>
  );
}
export default App;
