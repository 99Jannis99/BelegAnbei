import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useSelector } from "react-redux";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";

function TextScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    const { dataMorePages } = useSelector((state) => state.dataReducer);

    const [page, setPage] = useState({});

    useEffect(() => {
        setTimeout(() => {
            let useMorePages = JSON.parse(dataMorePages)

            let callname = route.params.params.callname
            console.log('callname', callname)
            
            let usePage = {}

            usePage.pageHeadline = useMorePages.find((item) => item.callname === callname) ?.headline || ""
            usePage.pageSubHeadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || ""
            usePage.pageContent = useMorePages.find((item) => item.callname === callname) ?.content || ""
        
            if(!usePage.pageContent && !usePage.pageHeadline) {
                usePage.pageHeadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || `Nicht gefunden`
                usePage.pageSubHeadline = useMorePages.find((item) => item.callname === callname) ?.subheadline || `Die angeforderte Seite "${callname}" wurden nicht gefunden.`
            }

            setPage(usePage)
        }, 250)
    }, [dataMorePages]);

    
    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>
                { !page.pageHeadline && !page.pageContent && <ActivityIndicator size={'large'} /> }
                <View>
                    {page.pageHeadline && 
                    <CustomText textType="headline" style={{}}>{ page.pageHeadline }</CustomText>
                    }
                    {page.pageSubHeadline && 
                        <CustomText textType="subheadline" style={{}}>{ page.pageSubHeadline }</CustomText>
                    }
                    {page.pageContent && page.pageContent != "" && 
                        <CustomHTML htmlContent={ page.pageContent }></CustomHTML>
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
