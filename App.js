import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import AuthScreen from './src/screens/AuthScreen';
import { savePost } from './src/services/storage';
import { COLORS } from './src/styles/theme';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState('HOME'); // 'HOME' or 'CREATE_POST'

  const renderScreen = () => {
    if (currentScreen === 'HOME') {
      return <HomeScreen onCreatePost={() => setCurrentScreen('CREATE_POST')} />;
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
      ) : (
        <AuthScreen onLogin={() => setIsLoggedIn(true)} />
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
