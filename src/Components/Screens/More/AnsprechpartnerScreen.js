import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import { DrawerContentScrollView } from "@react-navigation/drawer";

function AnsprechpartnerScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const { dataPersons } = useSelector(
    (state) => state.dataReducer
  );

  let usePersons = JSON.parse(dataPersons)
  usePersons = usePersons.filter((person) => {
    if(person.person_is_person != "1") {
      return false;
    }

    if(person.person_active != "1") {
      return false;
    }

    if(person.person_show.atall != "1") {
      return false;
    }

    return true;
  });
  console.log('usePersons', usePersons)

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>
        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>AnsprechpartnerScreen</Text>
        </View>
        <View style={styles.moreContent}>
          <Text>{JSON.stringify(usePersons, null, 2)}</Text>
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

export default AnsprechpartnerScreen;
