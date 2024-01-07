import React, { useState, useEffect, Fragment } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useSelector } from "react-redux";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function DownloadsScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);

    /* iOS SafeArea */
      const { dataStyle, dataSettings } = useSelector((state) => state.dataReducer);
      // top
      const [localSettings, setLocalSettings] = useState({});
      useEffect(() => {
        setLocalSettings(JSON.parse(dataSettings));
      }, [dataSettings]);
      // bottom
      const [localDataStyle, setLocalDataStyle] = useState({});
      useEffect(() => {
        setLocalDataStyle(JSON.parse(dataStyle));
      }, [dataStyle]);
    /* iOS SafeArea */

    const { dataMoreDownloads } = useSelector((state) => state.dataReducer);

    const [downloads, setDownloads] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const useDownloads = JSON.parse(dataMoreDownloads)
            setDownloads(useDownloads);
        }, 500)
    }, [dataMoreDownloads]);

    const fileType = (type: string) => {
        return type.toUpperCase();
    }

    const fileSize = (bytes: int) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }

    const makeDownload = (download: object) => {
        console.log('download', download)

        try {
            Linking.openURL(download.file.source)
        } catch(e) {
            //
        }
    }

    return (
      <Fragment>
        {localSettings.colors &&
          <SafeAreaView style={{ flex: 0, backgroundColor: localSettings.colors.statusbar_hex }} />
        }
        <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
          <Header></Header>
          <ScrollView style={[styles.content, { backgroundColor: background }]}>

                <View style={styles.contentView}>
                    <TextSnippet call="more-downloads-top" />
                    { downloads.length == 0 && <ActivityIndicator size={'large'} /> }
                </View>
                <View style={styles.contentView}>
                {
                    downloads.map((download, i) => (
                    <View key={i} style={{marginBottom: 24}}>
                        <TouchableOpacity key={i} activeOpacity={1} onPress={() => makeDownload(download)}>
                            <CustomText textType="subheadline" style={{}}>{download.headline}</CustomText>
                        </TouchableOpacity>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <CustomText fontType="light" style={{ flexBasis: 90 }}>Typ: {fileType(download.file.type)}</CustomText>
                            <CustomText fontType="light" style={{}}>Größe: {fileSize(download.file.size)}</CustomText>
                        </View>
                        {download.description &&
                            <CustomText textType="text" style={{}}>{download.description}</CustomText>
                        }
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
    },
    contentView: {
        padding: 12
    }
});


export default DownloadsScreen;
