import React, { useState, useEffect, Fragment } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { ListItem, Icon } from "@rneui/themed";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function AppointmentsScreen() {
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

    const { dataAppointments } = useSelector((state) => state.dataReducer);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            let useAppointments = JSON.parse(dataAppointments)

            setAppointments(useAppointments);
        }, 500)
    }, [dataAppointments]);

    return (
      <Fragment>
        {localSettings.colors &&
          <SafeAreaView style={{ flex: 0, backgroundColor: localSettings.colors.statusbar_hex }} />
        }
        <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
          <Header></Header>
          <ScrollView style={[styles.content, { backgroundColor: background }]}>
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
        </Fragment>
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
