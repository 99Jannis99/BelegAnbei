import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { useColors } from "../../Functions/getApiColors";

function ChangeColor() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { fetchColors } = useColors();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: primary }]}
        onPress={async () => await fetchColors()}
      >
        <Text style={[styles.text, { color: background }]}>get Colors</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  button: {
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default ChangeColor;
