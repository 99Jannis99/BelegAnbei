import React from "react";
import { View, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";
import BeispielScreen from "../Screens/BeispielScreen";

const DocumentsTopTaps = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.Container}>
      <Tab.Navigator
        tabBarPosition="top"
        screenOptions={{
          tabBarShowLabel: true,
          headerShown: false,
          swipeEnabled: true,
          tabBarStyle: {
            backgroundColor: background,
            elevation: 0,
            height: 60,
            borderTopWidth: 0,
            borderTopColor: background,
          },
          tabBarIndicatorStyle: {
            position: "absolute",
            bottom: 0,
            height: 2,
            backgroundColor: primary,
          },
          tabBarActiveTintColor: primary,
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {
            textTransform: "none",
            fontSize: 12,
          },
        }}
      >
        <Tab.Screen
          name="UnternehmenOnlineSettings"
          component={BeispielScreen}
          options={{ tabBarLabel: "Unternehmen Online" }}
        />
        <Tab.Screen
          name="MeineSteuernSettings"
          component={BeispielScreen}
          options={{ tabBarLabel: "Meine Steuern" }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    height: "100%",
  },
});

export default DocumentsTopTaps;
