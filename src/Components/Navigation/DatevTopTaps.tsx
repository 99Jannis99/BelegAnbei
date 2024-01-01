import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";

import DATEVDUOScreen from "../Screens/Settings/DATEVDUO";
import DATEVDMSScreen from "../Screens/Settings/DATEVDMS";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { dataStyle } = useSelector((state) => state.dataReducer);
  const [localDataStyle, setLocalDataStyle] = useState({});

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableHighlight
            key={route.key}
            underlayColor="black" // Farbe, die beim Drücken angezeigt wird
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isFocused
                ? localDataStyle.section_switcher_active_background
                : localDataStyle.section_switcher_background,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: isFocused
                  ? localDataStyle.section_switcher_active_color
                  : localDataStyle.section_switcher_color,
              }}
            >
              {label}
            </Text>
          </TouchableHighlight>
        );
      })}
    </View>
  );
};

const DatevTopTaps = () => {
  const { background } = useSelector((state) => state.colorReducer);
  const { dataStyle } = useSelector((state) => state.dataReducer);
  const Tab = createMaterialTopTabNavigator();
  const [localDataStyle, setLocalDataStyle] = useState({});

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);

  return (
    <View style={styles.Container}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
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
            backgroundColor: localDataStyle.section_switcher_background,
          },
          tabBarActiveTintColor: localDataStyle.primary,
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {
            textTransform: "none",
            fontSize: 12,
          },
        }}
      >
        <Tab.Screen
          name="UnternehmenOnlineSettings"
          component={DATEVDUOScreen}
          options={{ tabBarLabel: "Unternehmen Online" }}
        />
        <Tab.Screen
          name="MeineSteuernSettings"
          component={DATEVDMSScreen}
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
  tabContainer: {
    flexDirection: "row",
    height: 60,
  },
});

export default DatevTopTaps;
