import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLogin, onBackToLanding }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!username.trim()) {
            Alert.alert('Validation Error', 'Please enter your username');
            return false;
        }
        if (!password) {
            Alert.alert('Validation Error', 'Please enter your password');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const response = await fetch('https://smriti-backend-r293.onrender.com/api/auth/login', {
                method: 'POST', // Usually login is POST. If it fails, we can check if they really meant GET.
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Save token and user data
                const { token, ...userData } = data.data;
                await AsyncStorage.setItem('user_token', token);
                await AsyncStorage.setItem('user_data', JSON.stringify(userData));

                Alert.alert(
                    'Welcome Back! 🙏',
                    `Namaste, ${username}!`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                onLogin();
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Login Failed', data.error || data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Unable to connect to server. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🌳</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Enter your details to continue</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            placeholderTextColor={COLORS.textLight}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor={COLORS.textLight}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.background} />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBackToLanding}
                        disabled={loading}
                    >
                        <Text style={styles.backButtonText}>← Back to Landing</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logo: {
        fontSize: 64,
        marginBottom: SPACING.sm,
    },
    title: {
        ...TYPOGRAPHY.title,
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        fontSize: 16,
        color: COLORS.secondary,
    },
    formContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        ...TYPOGRAPHY.body,
        fontWeight: '500',
        marginBottom: SPACING.xs,
        color: COLORS.text,
    },
    input: {
        ...TYPOGRAPHY.body,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.md,
        backgroundColor: COLORS.background,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.small,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        ...TYPOGRAPHY.body,
        color: COLORS.background,
        fontWeight: '600',
    },
    backButton: {
        marginTop: SPACING.lg,
        alignItems: 'center',
    },
    backButtonText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.secondary,
        fontWeight: '500',
    },
});
