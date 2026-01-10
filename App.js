import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import AuthScreen from './src/screens/AuthScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import { savePost } from './src/services/storage';
import { COLORS } from './src/styles/theme';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState('HOME'); // 'HOME' or 'CREATE_POST'
  const [authMode, setAuthMode] = React.useState('LANDING'); // 'LANDING', 'SIGN_UP', 'LOGIN'

  const handleLogout = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.multiRemove(['user_token', 'user_data']);
      setIsLoggedIn(false);
      setAuthMode('LANDING');
      setCurrentScreen('HOME');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderScreen = () => {
    if (currentScreen === 'HOME') {
      return <HomeScreen
        onCreatePost={() => setCurrentScreen('CREATE_POST')}
        onLogout={handleLogout}
      />;
    }
    if (currentScreen === 'CREATE_POST') {
      return (
        <CreatePostScreen
          onCancel={() => setCurrentScreen('HOME')}
          onSave={async (post) => {
            console.log('App: Saving post...', post);
            const success = await savePost(post);
            console.log('App: Save result:', success);
            if (success) {
              setCurrentScreen('HOME');
            } else {
              // Handle error (maybe show alert? For now just log)
              console.error('App: Failed to save post');
            }
          }}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {isLoggedIn ? (
        renderScreen()
      ) : authMode === 'LANDING' ? (
        <LandingScreen
          onSignUpPress={() => setAuthMode('SIGN_UP')}
          onLoginPress={() => setAuthMode('LOGIN')}
        />
      ) : authMode === 'SIGN_UP' ? (
        <AuthScreen
          onLogin={() => setIsLoggedIn(true)}
          onBackToLanding={() => setAuthMode('LANDING')}
        />
      ) : (
        <LoginScreen
          onLogin={() => setIsLoggedIn(true)}
          onBackToLanding={() => setAuthMode('LANDING')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
