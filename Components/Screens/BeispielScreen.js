import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

function BeispielScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  return (
    <SafeAreaView
      style={[styles.ExampleSafeAreaView, { backgroundColor: background }]}
    >
      <View style={[styles.ExampleView, { backgroundColor: background }]}>
        <Text style={[styles.ExampleText, { color: primary }]}>Beispiel</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ExampleSafeAreaView: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
  },
  ExampleView: {
    backgroundColor: "#121212",
    flexDirection: "row",
    justifyContent: "center",
  },
  ExampleText: {
    color: "#48ac98",
    alignSelf: "center",
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default BeispielScreen;
