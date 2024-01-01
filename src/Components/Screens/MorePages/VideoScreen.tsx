import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Vimeo } from 'react-native-vimeo-iframe'
import YoutubePlayer from "react-native-youtube-iframe";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

function VideoScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    console.log('videoID', route.params.params.id)

    const { dataMoreVideos } = useSelector((state) => state.dataReducer);

    const [video, setVideo] = useState({});

    useEffect(() => {
        setTimeout(() => {
            let useVideos = JSON.parse(dataMoreVideos);
            let useVideo = useVideos.filter(function(video) {
            return video.video_id == route.params.params.id
            })[0];
            console.log('useVideo', useVideo)
        
            setVideo(useVideo);
        }, 500)
    }, [dataMoreVideos]);

    const sourceName = (source: string) => {
        return source.toUpperCase();
    }
    
    const videmoVideoCallbacks = {
        play: (data: any) => console.warn('play: ', data),
        pause: (data: any) => console.warn('pause: ', data),
        fullscreenchange: (data: any) => console.warn('fullscreenchange: ', data),
        ended: (data: any) => console.warn('ended: ', data),
        controlschange: (data: any) => console.warn('controlschange: ', data),
    }

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView>
                { !video.video_id && <ActivityIndicator size={'large'} /> }
                
                {video.video_id && 
                    <View>
                        <View style={styles.contentView}>
                            <CustomText textType="headline" style={{}}>{video.headline}</CustomText>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <CustomText fontType="light" style={{ fontSize:14 }}>Quelle: {sourceName(video.video.source)}</CustomText>
                                <CustomText fontType="light" style={{ fontSize:14 }}>Dauer: {video.video.data.duration} min.</CustomText>
                            </View>
                            {video.description && 
                                <CustomText fontType="light" style={{}}>{video.description}</CustomText>
                            }
                        </View>
                        {video.video.source == 'vimeo' && 
                            <View style={styles.contentView}>
                                <Vimeo 
                                style={{ width:"100%", aspectRatio: '16/9'}} 
                                videoId={video.video.data.id} 
                                handlers={videmoVideoCallbacks} />
                            </View>
                        }
                        {video.video.source == 'youtube' && 
                            <View style={styles.contentView}>
                                <YoutubePlayer
                                    height={300}
                                    videoId={video.video.data.id}
                                />
                            </View>
                        }
                    </View>
                }
                
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
        flex: 1,
        padding: 12
    }
});


export default VideoScreen;
