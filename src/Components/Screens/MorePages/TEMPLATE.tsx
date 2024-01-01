import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text } from "react-native";
import { useSelector } from "react-redux";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function TEMPLATEScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    console.log('route', route.params)

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView>
                
                <View style={styles.contentView}>
                    <CustomText textType="headline" style={{}}>HEADLINE</CustomText>
                    <CustomText textType="subheadline" style={{}}>SUBHEADLINE</CustomText>
                    <CustomText style={{}}>REGULAR</CustomText>
                    <CustomText fontType="bold" style={{}}>BOLD</CustomText>
                    <CustomText fontType="light" style={{}}>LIGHT</CustomText>
                </View>
                
                {/* <Text>{JSON.stringify(downloads, null, 2)}</Text> */}

                {/* Bottom Spacer */}
                <Text> </Text>
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


export default TEMPLATEScreen;
