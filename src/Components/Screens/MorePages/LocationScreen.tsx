import React, { useState, useEffect, useRef, Fragment } from "react";
import { Text, TouchableOpacity, View, SafeAreaView, StyleSheet, ScrollView, Dimensions, Linking, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "@rneui/themed";

import TextSnippet from "../../shared/TextSnippets";
import Header from "../../shared/Header";

import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import { Image } from "@rneui/base";
import CustomText from "../../shared/CustomText";
import { textFontSize } from "../../../../data/CustomerConstants";
import Contacts from "react-native-contacts";
import { widthPixel, heightPixel, fontPixel, pixelSizeVertical, pixelSizeHorizontal } from "../../shared/SizeNormalizer";

function LocationScreen({ route }) {
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

    const width = Dimensions.get('window').width;

    const mapRef = useRef(null);

    const { dataLocations } = useSelector((state) => state.dataReducer);

    const [location, setLocation] = useState({});
    const [centerCoords, setCenterCoords] = useState({});

    useEffect(() => {
        setTimeout(() => {
            let newLocations = JSON.parse(dataLocations);
            let useLocation = newLocations.filter(function(location) {
                return location.location_callname == route.params.params.callname
            })[0];
            console.log('useLocation', useLocation)

            setLocation(useLocation);
        }, 500)
    }, [dataLocations]);

    useEffect(() => {
        console.log('xxxxx location', location)

        mapRef?.current?.animateToRegion({
            latitude: location.location_lat ? parseFloat(location.location_lat) : 0,
            longitude: location.location_lon ? parseFloat(location.location_lon) : 0,
            latitudeDelta: 2,
            longitudeDelta: 4,
        }, 1000);
    }, [location]);

    return (
      <Fragment>
        {localSettings.colors &&
          <SafeAreaView style={{ flex: 0, backgroundColor: localSettings.colors.statusbar_hex }} />
        }
        <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
          <Header></Header>
          <ScrollView style={[styles.safeView, { backgroundColor: background }]}>
            <View style={styles.content}>
              <TextSnippet call="more-location-top" />
            </View>
            { !location.location_display_name && <ActivityIndicator size={'large'} /> }

            { location.location_display_name &&
                <View style={ styles.content }>
                    <CustomText textType="subheadline" style={{textAlign: "center" }}>{location.location_display_name}</CustomText>
                </View>
            }
            { location.location_lat && location.location_lon &&
                <MapView style={{width: width, height: (width*0.75)}}
                    ref={mapRef}
                    initialRegion={{
                        latitude: 0,
                        longitude:0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker.Animated
                        key={location.location_callname}
                        id={location.location_callname}
                        title={location.location_display_name}
                        coordinate={{
                            latitude: parseFloat(location.location_lat),
                            longitude: parseFloat(location.location_lon)
                        }}
                    />
                </MapView>
            }

            { location.location_id &&
            <ScrollView style={ styles.detailModalScrollView }>

                <View style={ styles.detailModalViewCol }>
                    <CustomText style={[styles.detailModalViewColText, {fontSize: fontPixel(textFontSize)}]}>
                        {location.location_address}
                        {"\n"}
                        {location.location_zip} {location.location_city}
                    </CustomText>
                </View>

                {location.location_email &&
                <View style={ styles.detailModalViewRow }>
                    <Icon
                        name="envelope"
                        size={fontPixel(textFontSize)}
                        style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                        allowFontScaling
                        type="font-awesome"
                    />

                    <TouchableOpacity activeOpacity={1} style={ styles.detailModalViewRowText } onPress={() => Linking.openURL(`mailto:${location.location_email}`)}>
                        <CustomText style={{fontSize: fontPixel(textFontSize)}}>{location.location_email}</CustomText>
                    </TouchableOpacity>
                </View>
                }

                {location.location_web &&
                <View style={ styles.detailModalViewRow }>
                    <Icon
                        name="link"
                        size={fontPixel(textFontSize)}
                        style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                        allowFontScaling
                        type="font-awesome"
                    />

                    <TouchableOpacity activeOpacity={1} style={ styles.detailModalViewRowText } onPress={() => Linking.openURL(`https://${location.location_web}`)}>
                        <CustomText style={{fontSize: fontPixel(textFontSize)}}>{location.location_web}</CustomText>
                    </TouchableOpacity>
                </View>
                }

                {location.location_phone.dial &&
                    <View style={ styles.detailModalViewRow }>
                        <Icon
                            name="phone"
                            size={fontPixel(textFontSize)}
                            style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                            allowFontScaling
                            type="font-awesome"
                        />

                        <TouchableOpacity activeOpacity={1} style={ styles.detailModalViewRowText } onPress={() => Linking.openURL(`tel:${location.location_phone.dial}`)}>
                            <CustomText style={{fontSize: fontPixel(textFontSize)}}>{location.location_phone.display}</CustomText>
                        </TouchableOpacity>
                    </View>
                }
                {location.location_fax.dial &&
                    <View style={ styles.detailModalViewRow }>
                        <Icon
                            name="fax"
                            size={fontPixel(textFontSize)}
                            style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                            allowFontScaling
                            type="font-awesome"
                        />
                        <CustomText style={[styles.detailModalViewRowText, {fontSize: fontPixel(textFontSize)}]}>{location.location_fax.display}</CustomText>
                    </View>
                }
                {location.location_cell.dial &&
                    <View style={ styles.detailModalViewRow }>
                        <Icon
                            name="mobile"
                            size={fontPixel(textFontSize)}
                            style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                            allowFontScaling
                            type="font-awesome"
                        />

                        <TouchableOpacity activeOpacity={1} style={ styles.detailModalViewRowText } onPress={() => Linking.openURL(`tel:${location.location_cell.dial}`)}>
                            <CustomText style={{fontSize: fontPixel(textFontSize)}}>{location.location_cell.display}</CustomText>
                        </TouchableOpacity>
                    </View>
                }
                <Text> </Text>

            </ScrollView>
            }

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
        padding: 12,
    },
    detailModal: {
      position: "relative"
    },

    detailModalView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12
    },
    detailModalViewRow: {
        flex: 1,
        flexBasis: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    detailModalViewCol: {
        flex: 1,
        flexBasis: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 12
    },
    detailModalViewRowIcon: {

    },
    detailModalViewRowText: {
        flexGrow: 1,
        paddingRight: 18,
        textAlign: "left",
    },
    detailModalViewColText: {
        flexBasis: "100%",
        textAlign: "left"
    },
    detailModalScrollView: {
        padding: 12,
        paddingBottom: 0,
    },
    detailView: {
        padding: 0,
        paddingBottom: 0,
    },
    detailModalViewImage: {
        width: "100%",
        height: 72,
        borderRadius: 12,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:0
    }
});


export default LocationScreen;
