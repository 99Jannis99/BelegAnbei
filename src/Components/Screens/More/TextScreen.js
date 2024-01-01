import React, { Component, useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";

import CustomHTML from "../../shared/CustomHTML";
import CustomText from "../../shared/CustomText";

function TextScreen({ route, navigation }) {
  const { background, primary } = useSelector((state) => state.colorReducer);

  const { dataMorePages } = useSelector(
    (state) => state.dataReducer
  );

  let useMorePages = JSON.parse(dataMorePages)

  let callname = route.params.params.callname

  let headline = useMorePages.find((item) => item.callname === callname) ?.headline || `NOT FOUND -> ${callname}`
  let subheadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || ""
  let content = useMorePages.find((item) => item.callname === callname) ?.content || ""

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <ScrollView>
        <View style={styles.moreContent}>
          <CustomText textType="headline" style={{}}>{ headline }</CustomText>
          {subheadline && 
            <CustomText textType="subheadline" style={{}}>{ subheadline }</CustomText>
          }
          <CustomHTML htmlContent={ content }></CustomHTML>
        </View>
      </ScrollView>
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
