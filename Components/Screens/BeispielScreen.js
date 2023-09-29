import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

export class BeispielScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.ExampleSafeAreaView}>
        <View style={styles.ExampleView}>
          <Text style={styles.ExampleText}>Beispiel</Text>
        </View>
      </SafeAreaView>
    );
  }
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
