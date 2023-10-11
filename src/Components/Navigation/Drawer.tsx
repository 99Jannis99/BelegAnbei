import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { SimpleLineIcons, Entypo } from "../../helpers/icons";
import {
  setBackground,
  setPrimary,
  setWelcomeImage,
  setLogoImage,
} from "../../redux/actions";
import { loadColors, loadImages } from "../../Functions/AsyncManager";
import LottieView from "lottie-react-native";

import BottomTaps from "./BottomTaps";
import BeispielScreen from "../Screens/BeispielScreen";

const DrawerComponent = () => {
  const [areColorsLoaded, setAreColorsLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const setColorsFromStorage = async () => {
      try {
        const colors = await loadColors();
        const images = await loadImages();
        dispatch(setBackground(colors.background));
        dispatch(setPrimary(colors.primary));
        dispatch(setWelcomeImage(images.welcomeImage));
        dispatch(setLogoImage(images.logoImage));
        setAreColorsLoaded(true); // Setzen des Zustands nachdem die Farben geladen wurden
      } catch (error) {
        console.error("Failed to load colors ore images in Drawer.tsx:", error);
      }
    };

    setColorsFromStorage();
  }, [dispatch]);

  const { background, primary } = useSelector((state) => state.colorReducer);
  const Drawer = createDrawerNavigator();

  if (!areColorsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          style={{ width: 200, height: 200 }}
          source={require("../../../assets/animations/flyer.json")}
          autoPlay
          loop
          speed={2}
        />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: background,
        },
        drawerActiveBackgroundColor: primary,
        drawerInactiveTintColor: "grey",
        drawerActiveTintColor: "white",
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          headerShown: false,
          drawerIcon: ({ focused, size }) => (
            <SimpleLineIcons
              name="home"
              size={size}
              color={focused ? "white" : "grey"}
            />
          ),
        }}
        component={BottomTaps}
      />
      <Drawer.Screen
        name="BeispielScreen"
        options={{
          headerShown: false,
          drawerIcon: ({ focused, size }) => (
            <Entypo
              name="windows-store"
              size={size}
              color={focused ? "white" : "grey"}
            />
          ),
        }}
        component={BeispielScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerComponent;
