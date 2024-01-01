import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useSelector } from "react-redux";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function DownloadsScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    console.log('route', route.params)

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
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView>
        
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
