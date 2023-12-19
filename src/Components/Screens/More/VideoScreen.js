import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import { DrawerContentScrollView } from "@react-navigation/drawer";

function VideoScreen({ route, navigation }) {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const { dataMoreVideos } = useSelector(
    (state) => state.dataReducer
  );

  let useVideos = JSON.parse(dataMoreVideos)
  console.log('useVideos', useVideos)

  let callname = route.params.callname_id
  console.log('callname', callname)
  let video = useVideos.find((item) => item.id === callname)
  console.log('video', video)

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>
        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>VideoScreen</Text>
        </View>
        <View style={styles.moreContent}>
          <Text>{JSON.stringify(video, null, 2)}</Text>
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

export default VideoScreen;
