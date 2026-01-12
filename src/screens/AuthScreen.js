import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/theme';
import { API_BASE_URL } from '../constants/config';
import { useAuth } from '../hooks/useAuth';
import { Input, Button } from '../components';

export default function AuthScreen({ onBackToLanding }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!username.trim()) {
            Alert.alert('Validation Error', 'Please enter a username');
            return false;
        }
        if (username.trim().length < 3) {
            Alert.alert('Validation Error', 'Username must be at least 3 characters');
            return false;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return false;
        }
        if (!password) {
            Alert.alert('Validation Error', 'Please enter a password');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const { token, ...userData } = data.data;

                // Use AuthContext login method
                await login(userData, token);

                Alert.alert(
                    'Success! 🙏',
                    `Welcome to Smriti, ${username}!\n\n${data.message}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Clear form
                                setUsername('');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Sign Up Failed', data.error || data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Sign up error:', error);
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
                    <Text style={styles.title}>Smriti</Text>
                    <Text style={styles.subtitle}>स्मृति</Text>
                    <Text style={styles.tagline}>A space for reflection</Text>
                </View>

                {/* Sign Up Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Create Account</Text>

                    <Input
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter username (min 3 characters)"
                    />

                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter password (min 6 characters)"
                        secureTextEntry
                    />

                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-enter password"
                        secureTextEntry
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSignUp}
                        loading={loading}
                        style={{ marginTop: SPACING.md }}
                    />

                    <Button
                        title="← Back to Landing"
                        onPress={onBackToLanding}
                        variant="outline"
                        disabled={loading}
                        style={{ marginTop: SPACING.lg }}
                    />

                    <Text style={styles.note}>
                        Note: This is Phase 1 - Sign up only. Login now available too!
                    </Text>
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
        marginBottom: SPACING.xxl,
    },
    logo: {
        fontSize: 64,
        marginBottom: SPACING.sm,
    },
    title: {
        ...TYPOGRAPHY.title,
        fontSize: 36,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 18,
        color: COLORS.secondary,
        marginBottom: SPACING.sm,
    },
    tagline: {
        ...TYPOGRAPHY.caption,
        fontStyle: 'italic',
    },
    formContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    formTitle: {
        ...TYPOGRAPHY.heading,
        marginBottom: SPACING.lg,
        textAlign: 'center',
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
    note: {
        ...TYPOGRAPHY.caption,
        textAlign: 'center',
        marginTop: SPACING.md,
        fontStyle: 'italic',
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
