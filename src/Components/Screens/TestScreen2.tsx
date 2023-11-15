import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const TestScreen2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Go back to Test Screen 1" onPress={() => navigation.navigate('TestScreen1')} />
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

export default TestScreen2;
