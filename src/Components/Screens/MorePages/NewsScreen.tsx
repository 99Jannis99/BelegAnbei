import React, { useState, useEffect, useRef, Fragment } from "react";
import { ActivityIndicator, Text, View, SafeAreaView, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { ListItem, Avatar, Icon } from "@rneui/themed";

import TextSnippet from "../../shared/TextSnippets";
import Header from "../../shared/Header";

import Modal from "react-native-modal";
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import { Image } from "@rneui/base";
import CustomText from "../../shared/CustomText";
import Contacts from "react-native-contacts";
import CustomHTML from "../../shared/CustomHTML";

const {width, height} = Dimensions.get('window');

function NewsScreen({route}) {
    const { background } = useSelector((state) => state.colorReducer);

    /* iOS SafeArea */
      const { dataStyle } = useSelector((state) => state.dataReducer);
      // top
      //b already in code
      // bottom
      const [localDataStyle, setLocalDataStyle] = useState({});
      useEffect(() => {
        setLocalDataStyle(JSON.parse(dataStyle));
      }, [dataStyle]);
    /* iOS SafeArea */

    const width = Dimensions.get('window').width;

    const mapRef = useRef(null);

    const { dataSettings, dataNews } = useSelector((state) => state.dataReducer);

    const [news, setNews] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            const useNews = JSON.parse(dataNews);
            setNews(useNews);
        }, 100)

    }, [dataNews]);

    const [settings, setSettings] = useState({});
    useEffect(() => {
        setTimeout(() => {
            const useSettings = JSON.parse(dataSettings);
            setSettings(useSettings);
        }, 100)
    }, [dataSettings]);


    const [selectedDetailNews, setSelectedDetailNews] = useState(0);
    const newsModal = (newsID: React.SetStateAction<number>) => {
        setSelectedDetailNews(newsID)
    };

    const toggleModal = () => {
        setSelectedDetailNews(0)
    };

    useEffect(() => {
        console.log('route', route.params)
        let givenID = 0;
        if(route.params.hasOwnProperty('params')) {
            console.log('PAAAAAAARAMS')
            givenID = route.params.params.id

            if(givenID > 0) {
                setSelectedDetailNews(givenID)
            }
        }
    }, [route]);

    return (
      <Fragment>
        {settings.colors &&
          <SafeAreaView style={{ flex: 0, backgroundColor: settings.colors.statusbar_hex }} />
        }
        <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
          <Header></Header>
          <ScrollView style={[styles.content, { backgroundColor: background }]}>
                <TextSnippet call="news-index" />
                { news.length == 0 && <ActivityIndicator size={'large'} /> }

                <View>
                {
                    news.map((newsItem, i) => (
                        <View key={i}>
                            <TouchableOpacity activeOpacity={1} style={{padding: 0, marginBottom: 12}} bottomDivider onPress={() => newsModal(newsItem.news_id)}>
                                <View style={{padding: 0, margin: 0}}>
                                    <CustomText fontType="bold" style={{marginBottom: 4}}>{newsItem.news_headline}</CustomText>
                                    <CustomText fontType="light" style={{ fontSize: 12, marginBottom: 4 }}>{newsItem.news_release_from}</CustomText>
                                    <CustomText fontType="regular" style={{marginBottom: 12}}>{newsItem.news_excerpt}</CustomText>
                                </View>
                            </TouchableOpacity>
                            <Modal
                                isVisible={newsItem.news_id === selectedDetailNews}
                                onBackButtonPress={toggleModal}
                                onBackdropPress={toggleModal}
                                style={ styles.detailModal }
                                >
                                    <View style={ styles.detailModalView }>
                                        <ScrollView style={ styles.detailModalScrollView }>
                                            <CustomText textType="headline" style={{ marginTop: 24 }}>{newsItem.news_headline}</CustomText>
                                            {newsItem.news_subheadline &&
                                                <CustomText textType="subheadline" style={{}}>{newsItem.news_subheadline}</CustomText>
                                            }
                                            <CustomHTML htmlContent={ newsItem.news_content }></CustomHTML>
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
                </View>
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


export default NewsScreen;
