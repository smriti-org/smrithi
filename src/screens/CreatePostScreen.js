import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../styles/theme';

export default function CreatePostScreen({ onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Incomplete', 'Please fill in both title and description');
            return;
        }
        // Create post object with timestamp
        const newPost = {
            title: title.trim(),
            description: description.trim(),
            author: 'Me', // Hardcoded for now until we have real user profiles
            date: new Date().toISOString(),
        };
        onSave(newPost);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>New Reflection</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What's on your mind?"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={50}
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Write your thoughts..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Post</Text>
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
});
