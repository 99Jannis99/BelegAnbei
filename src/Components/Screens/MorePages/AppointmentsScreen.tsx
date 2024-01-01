import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { ListItem, Icon } from "@rneui/themed";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function AppointmentsScreen() {
    const { background } = useSelector((state) => state.colorReducer);

    const { dataAppointments } = useSelector((state) => state.dataReducer);
    const [appointments, setAppointments] = useState([]);
    
    useEffect(() => {
        setTimeout(() => {
            let useAppointments = JSON.parse(dataAppointments)

            setAppointments(useAppointments);
        }, 500)
    }, [dataAppointments]);

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView>
                <View style={styles.content}>
                    <TextSnippet call="appointments-index" />
                    { appointments.length == 0 && <ActivityIndicator size={'large'} /> }
                </View>
          
                {
                    appointments.map((appointment, i) => (
                        <View key={i} style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start"}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
                                <Icon
                                name="calendar"
                                size={18}
                                style={{ aspectRatio: 1, marginRight: 8, paddingTop: 5, marginLeft: 12 }}
                                allowFontScaling
                                type="font-awesome"
                                />
                                <View key={i} style={{flex:1, flexDirection: "column", paddingRight: 12}}>
                                    <CustomText fontType="medium" style={{  }}>{appointment.start}</CustomText>           
                                    <CustomText fontType="bold" style={{ paddingRight: 24 }}>{appointment.title}</CustomText>           
                                    {appointment.desc && 
                                        <CustomText fontType="light" style={{ paddingRight: 24 }}>{appointment.desc}</CustomText> 
                                    }          
                                </View>                        
                            </View>                        
                        </View>
                    ))
                }
                
                {/* <Text>{JSON.stringify(appointments, null, 2)}</Text> */}

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


export default AppointmentsScreen;
