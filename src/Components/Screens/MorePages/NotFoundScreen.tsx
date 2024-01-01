import React, { useState, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { useSelector } from "react-redux";

import CustomHTML from "../../shared/CustomHTML";
import CustomText from "../../shared/CustomText";

import Header from "../../shared/Header";

function NotFoundScreen() {
  const { background } = useSelector((state) => state.colorReducer);
  /* const { dataMorePages, dataStyle } = useSelector(
    (state) => state.dataReducer
  );

  const [localDataMorePages, setLocalDataMorePages] = useState(null);
  useEffect(() => {
    setLocalDataMorePages(JSON.parse(dataMorePages));
    console.log("dataMorePages: ", dataMorePages);
  }, [dataMorePages]); */

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <ScrollView>
        <View style={styles.moreContent}>
          <CustomText textType="headline" style={{}}>Headline</CustomText>
          <CustomText textType="text" style={{}}>Te stdg dgsdgd g</CustomText>
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

export default NotFoundScreen;
