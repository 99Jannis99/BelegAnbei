import React, { Component } from "react";
import { Text, ScrollView, View, SafeAreaView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";

import TextSnippet from "../../shared/TextSnippets";
import CustomText from '../../shared/CustomText'

function BelegArchivScreen({ navigation }) {
  const { background, primary } = useSelector((state) => state.colorReducer);

setTimeout(() => {
  //navigation.openDrawer();
}, 2000)

  const { container, customTextStyle } = styles

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <ScrollView style={styles.moreContent}>
        <TextSnippet call="more-archive-top" />
     
        <View>
          <CustomText textType="headline" style={[customTextStyle, {}]}>HEADLINE</CustomText>
          <CustomText textType="subheadline" style={[customTextStyle, {}]}>SubHEADLINE</CustomText>
          <CustomText fontType="regular" style={[customTextStyle, {}]}>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. </CustomText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  moreSafeView: {
    flex: 1,
    flexDirection: "column"
  },
  moreContent: {
    marginTop: 2,
    marginBottom: 2,
    paddingLeft: 6,
    marginRight: 2,
    textAlign: "left"
  }
});

export default BelegArchivScreen;
