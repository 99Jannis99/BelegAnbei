import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";

function TextScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    const { dataMorePages } = useSelector((state) => state.dataReducer);

    let useMorePages = JSON.parse(dataMorePages)

    let callname = route.params.params.callname
    console.log('callname', callname)

    let pageHeadline = useMorePages.find((item) => item.callname === callname) ?.headline || ""
    let pageSubHeadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || ""
    let pageContent = useMorePages.find((item) => item.callname === callname) ?.content || ""

    if(!pageContent && !pageHeadline) {
        pageHeadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || `Nicht gefunden`
        pageSubHeadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || `Die angeforderte Seite "${callname}" wurden nicht gefunden.`
    }
    
    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>
                { !pageHeadline && !pageContent && <ActivityIndicator size={'large'} /> }
                <View>
                    {pageHeadline && 
                    <CustomText textType="headline" style={{}}>{ pageHeadline }</CustomText>
                    }
                    {pageSubHeadline && 
                        <CustomText textType="subheadline" style={{}}>{ pageSubHeadline }</CustomText>
                    }
                    {pageContent && pageContent != "" && 
                        <CustomHTML htmlContent={ pageContent }></CustomHTML>
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
        padding: 12
    }
});


export default TextScreen;
