import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
                    Author: {post.author?.username || 'Unknown'}
                </Text>
                <Text style={styles.postDate}>
                    {new Date(post.createdAt || post.date).toLocaleDateString()}
                </Text>
            </View>
            <Text style={styles.postDescription}>
                {post.textContent || post.description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        borderRadius: 12,
        ...SHADOWS.small,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    postTitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 4,
    },
    postMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    postAuthor: {
        ...TYPOGRAPHY.caption,
        color: COLORS.primary,
        fontWeight: '600',
    },
    postDate: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textLight,
    },
    postDescription: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: COLORS.text,
    },
});
