import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Keyboard } from 'react-native';
import * as Notifications from 'expo-notifications';
import { COLORS, SPACING, TYPOGRAPHY } from '../styles/theme';
import { createPost } from '../services/api';

export default function CreatePostScreen({ onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Error states for inline validation
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [serverError, setServerError] = useState('');

    const handleSave = async () => {
        Keyboard.dismiss();
        // Clear previous errors
        setTitleError('');
        setDescriptionError('');
        setServerError('');

        // Validate inputs
        let isValid = true;
        if (!title.trim()) {
            setTitleError('Please enter a title');
            isValid = false;
        }
        if (!description.trim()) {
            setDescriptionError('Please write your thoughts');
            isValid = false;
        }

        if (!isValid) return;

        setLoading(true);
        try {
            const result = await createPost({
                title: title.trim(),
                textContent: description.trim()
            });

            if (result.success) {
                // Show success notification
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "✨ Reflection added!",
                        body: `"${title.trim()}" has been saved to your reflections.`,
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                        vibrate: [0, 250, 250, 250],
                    },
                    trigger: null, // Show immediately
                });

                // Auto-redirect to home (no success alert)
                onSave(result.post);
            } else {
                setServerError(result.error || 'Failed to save post. Please try again.');
            }
        } catch (error) {
            setServerError('An unexpected error occurred. Please try again.');
            console.error('Error in handleSave:', error);
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
                <Text style={styles.headerTitle}>New Reflection</Text>

                {serverError ? (
                    <View style={styles.serverErrorContainer}>
                        <Text style={styles.serverErrorText}>{serverError}</Text>
                    </View>
                ) : null}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={[styles.input, titleError && styles.inputError]}
                        placeholder="What's on your mind?"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={50}
                        placeholderTextColor={COLORS.textLight}
                        editable={!loading}
                    />
                    {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, descriptionError && styles.inputError]}
                        placeholder="Write your thoughts..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                        placeholderTextColor={COLORS.textLight}
                        editable={!loading}
                    />
                    {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onCancel}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.background} />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Post</Text>
                        )}
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
        paddingTop: 50,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    headerTitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.primary,
        marginBottom: SPACING.xl,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        ...TYPOGRAPHY.heading,
        fontSize: 16,
        marginBottom: SPACING.sm,
        color: COLORS.secondary,
    },
    input: {
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        height: 150,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
    },
    button: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: SPACING.xs,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.secondary,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    disabledButton: {
        opacity: 0.5,
    },
    cancelButtonText: {
        ...TYPOGRAPHY.body,
        color: COLORS.secondary,
        fontWeight: '600',
    },
    saveButtonText: {
        ...TYPOGRAPHY.body,
        color: COLORS.background,
        fontWeight: '600',
    },
    inputError: {
        borderColor: '#f44',
        borderWidth: 2,
    },
    errorText: {
        color: '#c00',
        fontSize: 12,
        marginTop: 4,
    },
    serverErrorContainer: {
        backgroundColor: '#fee',
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.md,
        borderLeftWidth: 4,
        borderLeftColor: '#f44',
    },
    serverErrorText: {
        color: '#c00',
        fontSize: 14,
    },
});
