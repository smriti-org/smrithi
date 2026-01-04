import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import { COLORS } from './src/styles/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
