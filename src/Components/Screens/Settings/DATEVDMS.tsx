import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text } from "react-native";
import { useSelector } from "react-redux";

import CustomText from "../../shared/CustomText";
import TextSnippet from "../../shared/TextSnippets";

function DATEVDMSScreen() {
    const { background } = useSelector((state) => state.colorReducer);

    return (
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


export default DATEVDMSScreen;
