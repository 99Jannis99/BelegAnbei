import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { ListItem, Icon } from "@rneui/themed";

import TextSnippet from "../../shared/TextSnippets";
import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";

function FAQScreen() {
    const { background } = useSelector((state) => state.colorReducer);

    const { dataMoreFAQs } = useSelector((state) => state.dataReducer);
    const [faqs, setFaqs] = useState([]);

    const [selectedFAQ, setSelectedFAQ] = useState({});
    
    useEffect(() => {
        let useFAQs = JSON.parse(dataMoreFAQs)
        useFAQs = useFAQs.filter((faq: { for_system: string; }) => {
          if(faq.for_system == "both" || faq.for_system == Platform.OS)
          return true;
        });

        setFaqs(useFAQs);
    }, [dataMoreFAQs]);

    const useFAQ = (faq) => {
        if(faq == selectedFAQ) {
            setSelectedFAQ({})
        } else {
            setSelectedFAQ(faq)

        }
    }

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>
                <TextSnippet call="more-help-top" />
                { faqs.length == 0 && <ActivityIndicator size={'large'} /> }

                <View>
                {
                    faqs.map((faq, i) => (
                        <TouchableOpacity key={i} activeOpacity={1} onPress={() => useFAQ(faq)}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
                                <Icon
                                name="question"
                                size={18}
                                style={{ aspectRatio: 1, marginRight: 8, paddingTop: 9 }}
                                allowFontScaling
                                type="font-awesome"
                                />
                                <CustomText textType="subheadline" style={{ paddingRight: 24 }}>{faq.question}</CustomText>           
                            </View>
                            {selectedFAQ == faq && 
                                <View style={{ flex: 1, marginBottom: 24 }}>
                                    <CustomText style={{  }}>{faq.answer}</CustomText>
                                </View>
                            }                              
                        </TouchableOpacity>
                    ))
                }
                </View>
                
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


export default FAQScreen;
