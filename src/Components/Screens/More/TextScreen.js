import React, { Component, useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import RenderHtml from "react-native-render-html";

function TextScreen({ route, navigation }) {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const { dataMorePages } = useSelector(
    (state) => state.dataReducer
  );

  let useMorePages = JSON.parse(dataMorePages)

  let callname = route.params.callname
  let headline = useMorePages.find((item) => item.callname === callname) ?.headline || ""
  let content = useMorePages.find((item) => item.callname === callname) ?.content || ""

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <View>
        <Text style={[styles.moreHeadline, { color: primary }]}>{ headline }</Text>
      </View>
      <View style={styles.moreContent}>
        <RenderHtml
          contentWidth={width}
          source={{
            html: content
          }}
        />
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

export default TextScreen;
