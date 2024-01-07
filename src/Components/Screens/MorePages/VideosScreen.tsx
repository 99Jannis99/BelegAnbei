import React, { useState, useEffect, Fragment } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Dimensions  } from "react-native";
import { useSelector } from "react-redux";
import { Vimeo } from 'react-native-vimeo-iframe'
import YoutubePlayer from "react-native-youtube-iframe";
import Modal from "react-native-modal";
import { Image } from "@rneui/base";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function VideosScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);

    /* iOS SafeArea */
      const { dataStyle } = useSelector((state) => state.dataReducer);
      // top
      // custom here -> settings
      // bottom
      const [localDataStyle, setLocalDataStyle] = useState({});
      useEffect(() => {
        setLocalDataStyle(JSON.parse(dataStyle));
      }, [dataStyle]);
    /* iOS SafeArea */

    const { dataSettings, dataMoreVideos } = useSelector((state) => state.dataReducer);
    const [videos, setVideos] = useState([]);

    const [selectedVideo, setSelectedVideo] = useState({});

    useEffect(() => {
        setTimeout(() => {
            let useVideos = JSON.parse(dataMoreVideos)
            setVideos(useVideos);
        }, 500)
    }, [dataMoreVideos]);

    const [settings, setSettings] = useState({});
    useEffect(() => {
        setTimeout(() => {
            const useSettings = JSON.parse(dataSettings);
            setSettings(useSettings);
        }, 500)
    }, [dataSettings]);

    const sourceName = (source: string) => {
        return source.toUpperCase();
    }

    const toggleModal = () => {
        setSelectedVideo({})
    };

    const videoHeight = ((Dimensions.get("window").width-24) / 16) * 9;

    return (
        <Fragment>
          {settings.colors &&
            <SafeAreaView style={{ flex: 0, backgroundColor: settings.colors.statusbar_hex }} />
          }
          <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
            <Header></Header>
            <ScrollView style={[styles.contentView, { backgroundColor: background }]}>
              <TextSnippet call="more-video-top" />
              { videos.length == 0 && <ActivityIndicator size={'large'} /> }

              {
                  videos.map((video, i) => (
                      <View key={i}>
                          <TouchableOpacity activeOpacity={1} style={{marginBottom: 24}} onPress={() => setSelectedVideo(video)}>
                              <CustomText textType="subheadline" style={{}}>{video.headline}</CustomText>
                              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
                                  <CustomText fontType="light" style={{ fontSize:14 }}>Quelle: {sourceName(video.video.source)}</CustomText>
                                  <CustomText fontType="light" style={{ fontSize:14 }}>Dauer: {video.video.data.duration} min.</CustomText>
                              </View>
                              {video.description &&
                                  <CustomText textType="text" style={{}}>{video.description}</CustomText>
                              }
                          </TouchableOpacity>

                          <Modal
                              isVisible={video === selectedVideo}
                              onBackButtonPress={toggleModal}
                              onBackdropPress={toggleModal}
                              style={ styles.detailModal }
                              >
                                  <View style={ styles.detailModalView }>
                                      <ScrollView style={ styles.detailModalScrollView }>
                                          <CustomText textType="subheadline" style={{ marginTop: 24, marginBottom: 24 }}>{video.headline}</CustomText>

                                          {video.video.source == 'vimeo' &&
                                              <Vimeo
                                                  style={{ width:"100%", height: videoHeight}}
                                                  videoId={video.video.data.id}
                                              />
                                          }
                                          {video.video.source == 'youtube' &&
                                              <YoutubePlayer
                                                  height={videoHeight}
                                                  videoId={video.video.data.id}
                                              />
                                          }

                                          {video.description &&
                                              <CustomText textType="text" style={{}}>{video.description}</CustomText>
                                          }
                                          <Text> </Text>
                                      </ScrollView>

                                      {settings.colors &&
                                      <View style={[styles.detailModalClose, {backgroundColor: settings.colors.background_hex}] }>
                                          <Image
                                          onPress={toggleModal}
                                          style={ {width:36, height: 36} }
                                          source={require("../../../../assets/images/icon_cancel.png")}
                                          />
                                      </View>
                                      }
                                  </View>
                          </Modal>
                      </View>
                  ))
              }

                <Text> </Text>
              </ScrollView>
          </SafeAreaView>
      </Fragment>
    );
}



const styles = StyleSheet.create({
    safeView: {
        flex: 1
    },
    content: {
    },
    contentView: {
        padding: 12
    },
    detailModal: {
      position: "relative",
      marginTop: 50
    },
    detailModalClose: {
      position: "absolute",
      right: 12,
      top: 12,
      width: 42,
      height: 42,
      backgroundColor: "#333333",
      borderRadius: 21,
      borderColor: "#FA2000",
      justifyContent: "center",
      alignItems: "center"
    },
    detailModalView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12
    },
    detailModalScrollView: {
        padding: 12
    }
});


export default VideosScreen;
