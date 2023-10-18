// Importieren der notwendigen Module und Komponenten aus React, React Native und anderen Bibliotheken
import React from "react";
import { View, StyleSheet } from "react-native"; // Grundlegende Komponenten für die UI
import { SimpleLineIcons } from "../../helpers/icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"; // Navigation-Komponente für Tabs
import { useSelector } from "react-redux";

// Importieren zusätzlicher Bildschirmkomponenten
import Welcome from "../Screens/Welcome";
import SettingsTopTaps from "../Navigation/SettingsTopTaps";
import DocumentsTopTaps from "../Navigation/DocumentsTopTaps";

import BeispielScreen from "../Screens/BeispielScreen";
import ChangeColor from "../Screens/ChangeColor";

import Header from "../shared/Header";

// Komponente für die unteren Tabs
const BottomTaps = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);

  const Tab = createMaterialTopTabNavigator(); // Erstellen eines Tab-Navigators

  // Render-Methode der Komponente
  return (
    // Haupt-View-Komponente
    <View style={styles.Container}>
      {/* Header Komponente mit Logo etc... */}
      <Header />

      {/* Tab-Navigator-Komponente, die mehrere Bildschirme als Tabs anzeigt */}
      <Tab.Navigator
        tabBarPosition="bottom" // Position der Tab-Leiste
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          swipeEnabled: false,
          tabBarStyle: {
            backgroundColor: background,
            elevation: 0,
            height: 60,
            borderTopWidth: 1,
            borderTopColor: background,
          },
          tabBarIndicatorStyle: {
            position: "absolute",
            top: 0,
            height: 2,
            backgroundColor: primary,
          },
        }} // Styling-Optionen für den Navigator
      >
        {/* Definieren der einzelnen Tabs mit zugehörigen Bildschirmkomponenten und Icons */}
        <Tab.Screen
          name="Welcome" // Name des Tabs
          component={Welcome} // Komponente, die im Tab angezeigt wird
          options={{
            tabBarIcon: (
              { focused } // Icon für den Tab
            ) =>
              focused ? (
                <SimpleLineIcons name="home" size={22.5} color={primary} />
              ) : (
                <SimpleLineIcons name="home" size={22.5} color="grey" />
              ),
          }}
        />

        {/* Weitere Tabs ... */}
        <Tab.Screen
          name="Settings"
          component={SettingsTopTaps}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <SimpleLineIcons name="settings" size={22.5} color={primary} />
              ) : (
                <SimpleLineIcons name="settings" size={22.5} color="grey" />
              ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={ChangeColor}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <SimpleLineIcons name="camera" size={22.5} color={primary} />
              ) : (
                <SimpleLineIcons name="camera" size={22.5} color="grey" />
              ),
          }}
        />
        <Tab.Screen
          name="Documents"
          component={DocumentsTopTaps}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <SimpleLineIcons name="docs" size={22.5} color={primary} />
              ) : (
                <SimpleLineIcons name="docs" size={22.5} color="grey" />
              ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  NavigatorScreenOptions: {
    tabBarShowLabel: false,
    headerShown: false,
    swipeEnabled: false,
    tabBarStyle: {
      backgroundColor: "#121212",
      elevation: 0,
      height: 60,
      borderTopWidth: 1,
      borderTopColor: "#1b1b1b",
    },
    tabBarIndicatorStyle: {
      position: "absolute",
      top: 0,
      height: 2,
      backgroundColor: "#48ac98",
    },
  },

  Container: {
    height: "100%",
  },
});

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default BottomTaps;
