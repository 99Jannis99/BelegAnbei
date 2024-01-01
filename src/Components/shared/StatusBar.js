import React, { useEffect, useState } from 'react';

import {NativeModules, StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const { StatusBar } = NativeModules;

const initStatusBar = (color) => {
  try {
    StatusBar.setColor(color)
  } catch(e) {
    console.log('initStatusBar e', e)
  }
}

const StatusBarColorButton = (props) => {
  const onPress = async () => {
    console.log('StatusBarColorButton onPress', props.color);

    StatusBar.setColor(props.color)
  };

  return (
    <View>
      <TouchableOpacity style={styles.btnBody} onPress={onPress}>
          <Text style={styles.btnText}>
              Set Color
          </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    btnBody: {
        backgroundColor: '#25D366',
        width: '100%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 24
    }
});

export { StatusBarColorButton, initStatusBar };
