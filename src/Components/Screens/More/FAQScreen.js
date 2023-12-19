import React, { Component } from "react";
import { Platform, Text, View, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import { DrawerContentScrollView } from "@react-navigation/drawer";

function FAQScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const { dataMoreFAQs } = useSelector(
    (state) => state.dataReducer
  );

  let useFAQs = JSON.parse(dataMoreFAQs)
  useFAQs = useFAQs.filter((faq) => {
    if(faq.for_system == "both" || faq.for_system == Platform.OS)
    return true;
  });
  console.log('useFAQs', useFAQs)

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>
        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>FAQScreen</Text>
        </View>
        <View style={styles.moreContent}>
          <Text>Gefiltert für "{Platform.OS}"</Text>
          <Text>{JSON.stringify(useFAQs, null, 2)}</Text>
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

export default FAQScreen;
