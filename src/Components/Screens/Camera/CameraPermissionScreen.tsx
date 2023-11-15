import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CameraPermissionScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleAccept = async () => {
    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      switch (result) {
        case RESULTS.GRANTED:
          console.log('Die Berechtigung für die Kamera wurde erteilt.');
          AsyncStorage.setItem('cameraPermissionGranted', 'true');
          // Alternativ können Sie hier eine Redux-Aktion dispatchen
          // dispatch(setCameraPermission(true));
          navigation.navigate('CameraStandard');
          break;
        case RESULTS.DENIED:
          console.log('Die Berechtigung für die Kamera wurde verweigert, ist aber anfragbar.');
          break;
        case RESULTS.BLOCKED:
          console.log('Die Berechtigung für die Kamera wurde dauerhaft verweigert.');
          Alert.alert(
            'Berechtigung verweigert',
            'Bitte erlauben Sie den Zugriff auf die Kamera in Ihren Einstellungen.',
            [{ text: 'OK' }],
          );
          break;
      }
    }).catch((error) => {
      console.warn('Fehler bei der Berechtigungsanfrage:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text>Bitte erlauben Sie den Zugriff auf die Kamera</Text>
      <Button title="Annehmen" onPress={handleAccept} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraPermissionScreen;
