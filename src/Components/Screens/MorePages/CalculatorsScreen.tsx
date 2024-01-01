import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text } from "react-native";
import { useSelector } from "react-redux";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function FormulareScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    console.log('route', route.params)

    let type = "overview";

    if(route.params.params.callname == "mwst") {
        type = "mwst";
    }

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>
                <TextSnippet call="more-calculators-top" />
               
                <CustomText fontType="bold" style={{textAlign: "center", fontSize: 96}}>ToDo</CustomText>
                <CustomText fontType="bold" style={{textAlign: "center", fontSize: 48}}>Type: {type}</CustomText>
                
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
        padding: 12
    }
});


export default FormulareScreen;
