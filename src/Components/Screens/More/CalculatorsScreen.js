import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";

function CalculatorsScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <View>
        <Text style={[styles.moreHeadline, { color: primary }]}>CalculatorsScreen</Text>
      </View>
      <View style={styles.moreContent}>
        <Text>gtr t345t 3h94rh3498 rh34r3q409r hz4w0789fhrwpifuh4w309u8t z3qt03qzrh34q0ßrh3w4q0rh34wq098rh43798rz h34798r34 47 7ez 34qrz 349r z{"\n"}sdfsdfsdf</Text>
      </View>
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

export default CalculatorsScreen;
