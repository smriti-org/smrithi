import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../styles/theme';

/**
 * PostCard Component - Displays a single post
 * @param {object} post - Post data
 */
export default function PostCard({ post }) {
    // Helper to get property with fallback
    const getProp = (key, fallbackKey) => post[key] || post[fallbackKey];

    const imageUrl = getProp('imageUrl', 'image_url');
    const documentUrl = getProp('documentUrl', 'document_url');
    const authorName = post.author?.username || post.author_name || 'Unknown';
    const postDate = new Date(post.createdAt || post.created_at || post.date).toLocaleDateString();
    const content = post.textContent || post.text_content || post.description;

    // Dynamic Image Sizing
    const [aspectRatio, setAspectRatio] = React.useState(4 / 3); // Default aspect ratio

    React.useEffect(() => {
        if (imageUrl) {
            Image.getSize(imageUrl, (width, height) => {
                if (width && height) {
                    setAspectRatio(width / height);
                }
            }, (error) => {
                console.warn('Failed to calculate image size', error);
            });
        }
    }, [imageUrl]);

    return (
        <View style={styles.postCard}>
            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <View style={styles.postMeta}>
                    <Text style={styles.postAuthor}>
                        Author: {authorName}
                    </Text>
                    <Text style={styles.postDate}>
                        {postDate}
                    </Text>
                </View>
                <Text style={styles.postDescription}>
                    {content}
                </Text>

                {/* Display image if available */}
                {imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={[styles.postImage, { aspectRatio }]}
                        resizeMode="contain"
                    />
                )}

                {/* Display document link if available */}
                {documentUrl && (
                    <TouchableOpacity
                        style={styles.documentContainer}
                        onPress={() => Linking.openURL(documentUrl)}
                    >
                        <View style={styles.documentIconContainer}>
                            <Text style={styles.documentIcon}>📄</Text>
                        </View>
                        <View style={styles.documentInfo}>
                            <Text style={styles.documentTitle} numberOfLines={1}>
                                Attached Document
                            </Text>
                            <Text style={styles.documentAction}>Tap to view</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        borderRadius: 12,
        ...SHADOWS.small,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        overflow: 'hidden', // Ensure image respects border radius
    },
    postImage: {
        width: '100%',
        backgroundColor: COLORS.border,
        marginTop: SPACING.md,
    },
    postContent: {
        padding: SPACING.md,
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
    documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: 8,
        marginTop: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    documentIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    documentIcon: {
        fontSize: 20,
    },
    documentInfo: {
        flex: 1,
    },
    documentTitle: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    documentAction: {
        ...TYPOGRAPHY.caption,
        color: COLORS.primary,
    },
});
