import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const TestScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Go to Test Screen 2" onPress={() => navigation.navigate('TestScreen2')} />
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

export default TestScreen1;
