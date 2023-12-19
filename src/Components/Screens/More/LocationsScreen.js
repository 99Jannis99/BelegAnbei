import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import { DrawerContentScrollView } from "@react-navigation/drawer";

function LocationsScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const { dataLocations } = useSelector(
    (state) => state.dataReducer
  );

  let useLocations = JSON.parse(dataLocations)
  useLocations = useLocations.filter((location) => {
    if(location.location_has_only_persons == "1") {
      return false;
    }

    return true;
  });
  console.log('useLocations', useLocations)

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>
        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>LocationsScreen</Text>
        </View>
        <View style={styles.moreContent}>
          <Text>{JSON.stringify(useLocations, null, 2)}</Text>
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

export default LocationsScreen;
