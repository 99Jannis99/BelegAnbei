import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";

import BeispielScreen from "../Screens/BeispielScreen";
import DatevTopTaps from "./DatevTopTaps";
import Standard from "./StandardDocumentsStack";
import useShouldShowDatevAsMain from "../../helpers/moduleCalculations";

const Tab = createMaterialTopTabNavigator();

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
            underlayColor={localDataStyle.section_switcher_active_background}
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

const DocumentsTopTaps = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const [modules, setModules] = useState({
    standard: true,
    einkommenssteuer: true,
    belegzentrale: true,
    datev: {
      unternehmenonline: true,
      meinesteuern: true,
    },
  });

  const shouldShowDatevAsMain = useShouldShowDatevAsMain(modules);

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
        {modules.standard && (
          <Tab.Screen
            name="StandardDocuments"
            component={Standard}
            options={{ tabBarLabel: "Standard" }}
          />
        )}
        {modules.einkommenssteuer && (
          <Tab.Screen
            name="EinkommenssteuerDocuments"
            component={Standard}
            options={{ tabBarLabel: "Einkom-\nmenssteuer" }}
          />
        )}
        {shouldShowDatevAsMain ? (
          <Tab.Screen
            name="DatevDocuments"
            component={DatevTopTaps}
            options={{ tabBarLabel: "DATEV" }}
          />
        ) : (
          <>
            {modules.datev.unternehmenonline && (
              <Tab.Screen
                name="UnternehmenOnlineDocuments"
                component={BeispielScreen}
                options={{ tabBarLabel: "Unternehmen Online" }}
              />
            )}
            {modules.datev.meinesteuern && (
              <Tab.Screen
                name="MeineSteuernDocuments"
                component={BeispielScreen}
                options={{ tabBarLabel: "Meine Steuern" }}
              />
            )}
          </>
        )}
        {modules.belegzentrale && (
          <Tab.Screen
            name="BelegzentraleDocuments"
            component={BeispielScreen}
            options={{ tabBarLabel: "Beleg-\nzentrale" }}
          />
        )}
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

export default DocumentsTopTaps;
