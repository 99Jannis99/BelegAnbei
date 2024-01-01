import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { use } from "i18next";
import { Button } from "react-native";

import CustomHTML from "../shared/CustomHTML";
import CustomText from "../shared/CustomText";
import TextSnippet from "../shared/TextSnippets";

const Welcome = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dataCustomer, dataSettings, dataMorePages, dataStyle, dataNews } = useSelector(
    (state) => state.dataReducer
  );

  const { datevClient } = useSelector((state) => state.datevReducer);

  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataMorePages, setLocalDataMorePages] = useState(null);
  const [localDataStyle, setLocalDataStyle] = useState({});
  const [localDataNews, setLocalDataNews] = useState([]);

  const updateDatev = (newClients) => {
    dispatch({ type: "SET_DATEV_CLIENT", payload: newClients });
  };

  const { width } = useWindowDimensions();

  // console.log("dataSettings: ", JSON.parse(dataSettings).statusbar_hex);
  const { welcomeImage, lastUpdated } = useSelector(
    (state) => state.imageReducer
  );

  useEffect(() => {
    setlocalDataSettings(JSON.parse(dataSettings));
  }, [dataSettings]);

  useEffect(() => {
    setLocalDataMorePages(JSON.parse(dataMorePages));
  }, [dataMorePages]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);

  useEffect(() => {
    setTimeout(() => {
      if(localDataSettings.hasOwnProperty('news')) {
        let news = JSON.parse(dataNews);
        const limitNews = news.slice(0, localDataSettings.news.settings.show_home_amount);
        //const limitNews = news.slice(0, 5);
        setLocalDataNews(limitNews);
      }
    }, 1000)
  }, [dataSettings]);

  useEffect(() => {
    setTimeout(() => {
      if(localDataSettings.hasOwnProperty('news')) {
        let news = JSON.parse(dataNews);
        const limitNews = news.slice(0, localDataSettings.news.settings.show_home_amount);
        //const limitNews = news.slice(0, 5);
        setLocalDataNews(limitNews);
      }
    }, 1000)
  }, [localDataSettings]);

  const openNews = (news) => {
    console.log('news', news)

    navigation.navigate("Neuigkeiten", {
      params: {
        id: news.news_id
      }
    });
  }

  // useEffect(() => {
  //   console.log("datevClient: ", datevClient);
  // }, [datevClient]);

  //let headline = dataMorePages.find((item) => item.callname === "home") ?.headline || `NOT FOUND -> HOME`
  //let content = dataMorePages.find((item) => item.callname === "home") ?.content || ""

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: localDataStyle.body_background_color,
          // backgroundColor: localDataStyle.body_font_color
        },
      ]}
    >
      <Image
        source={{ uri: `${welcomeImage}?t=${lastUpdated}` }}
        style={styles.image}
      />

      {/* Textkomponenten */}
      {localDataMorePages && (
        <View style={styles.content}>
          <CustomText textType="headline" style={{}}>{ localDataMorePages.find((item) => item.callname === "home") ?.headline || "" }</CustomText>
          <CustomHTML htmlContent={ localDataMorePages.find((item) => item.callname === "home") ?.content || "" }></CustomHTML>
        </View>
      )}

      { localDataSettings.news && 
        <View style={{}}>
          <View style={{padding: 18, paddingBottom:0}}>
            <TextSnippet call="news-home" />
          </View>
          <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 0, paddingBottom:0}}>
            {
            localDataSettings.news.settings.show_home && localDataNews.map((newsItem, i) => (
                  <TouchableOpacity key={i} activeOpacity={i} style={{padding: 0, marginBottom: 12}} onPress={() => { openNews(newsItem) }}>
                      <View style={{padding: 0, margin: 0}}>
                          <CustomText fontType="bold" style={{}}>{newsItem.news_headline}</CustomText>
                          <CustomText fontType="bold" style={{ fontSize: 12 }}>{newsItem.news_release_from}</CustomText>
                          <CustomText fontType="light" style={{}}>{newsItem.news_excerpt}</CustomText>
                      </View>
                  </TouchableOpacity>
                ))
            }
          </View>
        </View>
      }

      {/* <Text>{JSON.stringify(localDataSettings.news, null, 2)}</Text> */}

      {/* <Button
        title="updateClient"
        onPress={()=>updateDatev(["Sahra", "Navin", "Bernd"])}
      ></Button> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
  },
  image: {
    width: "100%", // Bildbreite nimmt den gesamten verfügbaren Platz ein
    height: 200, // Höhe des Bildes
    resizeMode: "stretch", // Bild wird beschnitten, um die Größe zu füllen, ohne das Seitenverhältnis zu verzerren
  },
  headline: {
    paddingVertical: 10, // Innenabstand um den Text
    paddingHorizontal: 20,
    fontSize: 20, // Schriftgröße des Textes
    color: "#48ac98",
  },
  text: {
    paddingVertical: 10, // Innenabstand um den Text
    paddingHorizontal: 20,
    fontSize: 16, // Schriftgröße des Textes
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: "black",
  },
});

export default Welcome;
