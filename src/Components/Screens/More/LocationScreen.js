import React, { Component, useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import RenderHtml from "react-native-render-html";
import { DrawerContentScrollView } from "@react-navigation/drawer";


function LocationScreen({ route, navigation }) {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const { dataLocations } = useSelector(
    (state) => state.dataReducer
  );

  let useLocations = JSON.parse(dataLocations)

  let callname = route.params.params.callname
  console.log('callname', callname)
  
  let location = useLocations.find((item) => item.location_callname === callname)
  console.log('location', location)

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>
        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>{ location.location_display_name }</Text>
        </View>
        <View style={styles.moreContent}>
          <Text>{location.location_display_name}</Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  moreSafeView: {
    flex: 1
  },
  moreHeadline: {
    fontSize: 32,
    color: "#fa2000",
    marginTop: 12,
    marginBottom: 12,
    textAlign: "center"
  },
  moreContent: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12,
    textAlign: "center"
  }
});

export default LocationScreen;
