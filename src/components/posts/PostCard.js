import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../styles/theme';

/**
 * PostCard Component - Displays a single post
 * @param {object} post - Post data
 */
export default function PostCard({ post }) {
    return (
        <View style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <View style={styles.postMeta}>
                <Text style={styles.postAuthor}>
                    {post.author?.username || 'Unknown'}
                </Text>
                <Text style={styles.postDate}>
                    {new Date(post.createdAt || post.date).toLocaleDateString()}
                </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.postDescription}>
                {post.textContent || post.description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: COLORS.card,
        padding: SPACING.lg,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        borderRadius: 20,
        ...SHADOWS.medium,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.1,
        borderWidth: 1.5,
        borderColor: 'rgba(78, 52, 46, 0.2)', // Increased visibility
    },
    postTitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 20,
        color: COLORS.primary,
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '700',
    },
    postMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    postAuthor: {
        ...TYPOGRAPHY.caption,
        color: COLORS.secondary,
        fontStyle: 'italic',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    postDate: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textLight,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        opacity: 0.7,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        opacity: 0.5,
        marginBottom: SPACING.md,
    },
    postDescription: {
        ...TYPOGRAPHY.body,
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
});
