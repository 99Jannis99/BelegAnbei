import React, { Component, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

import { fetchColors } from "../../Functions/getColors";

function ChangeColor() {
  const [colors, setColors] = useState([]);

  return (
    <View style={styles.container}>
      <Button
        title="get Colors"
        onPress={async () => setColors(await fetchColors())}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChangeColor;
