import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import AuthScreen from './src/screens/AuthScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import { COLORS } from './src/styles/theme';

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';

// Main App Content (uses auth context)
function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = React.useState('HOME'); // 'HOME' or 'CREATE_POST'
  const [authMode, setAuthMode] = React.useState('LANDING'); // 'LANDING', 'SIGN_UP', 'LOGIN'

  // Check for existing token on app mount (persistent login)
  React.useEffect(() => {
    registerForPushNotificationsAsync();
    // checkExistingAuth(); // Assuming checkExistingAuth is defined elsewhere or will be added.
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B7355',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions');
      return;
    }
  }

  const handleLogout = async () => {
    await logout();
    setAuthMode('LANDING');
    setCurrentScreen('HOME');
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
          onSave={(post) => {
            setCurrentScreen('HOME');
          }}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Loading state while checking auth */}
        </View>
      ) : isAuthenticated ? (
        renderScreen()
      ) : authMode === 'LANDING' ? (
        <LandingScreen
          onSignUpPress={() => setAuthMode('SIGN_UP')}
          onLoginPress={() => setAuthMode('LOGIN')}
        />
      ) : authMode === 'SIGN_UP' ? (
        <AuthScreen
          onBackToLanding={() => setAuthMode('LANDING')}
        />
      ) : (
        <LoginScreen
          onBackToLanding={() => setAuthMode('LANDING')}
        />
      )}
    </View>
  );
}

// Root App Component with Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
