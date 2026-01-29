import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform } from 'react-native';
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
    const postDate = new Date(post.createdAt || post.created_at || post.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const content = post.textContent || post.text_content || post.description;

    // Expandable content state
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [textTruncated, setTextTruncated] = React.useState(false);
    const [measured, setMeasured] = React.useState(false);

    // Dynamic Image Sizing
    const [aspectRatio, setAspectRatio] = React.useState(4 / 3);

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

    const handleTextLayout = (e) => {
        if (!measured) {
            // First render - measure full text
            const lines = e.nativeEvent.lines;
            if (lines.length > 6) {
                setTextTruncated(true);
            }
            setMeasured(true);
        }
    };

    return (
        <View style={styles.postCard}>
            <View style={styles.postContent}>
                {/* Decorative top divider */}
                <View style={styles.topDivider}>
                    <Text style={styles.decorativeIcon}>✦</Text>
                </View>

                {/* Title - Clean and prominent */}
                <Text style={styles.postTitle}>{post.title}</Text>

                {/* Reflection content - Uninterrupted flow */}
                <Text
                    style={styles.postDescription}
                    numberOfLines={measured && !isExpanded ? 6 : undefined}
                    onTextLayout={handleTextLayout}
                >
                    {content}
                </Text>

                {/* Load more / Show less button */}
                {textTruncated && (
                    <TouchableOpacity
                        onPress={() => setIsExpanded(!isExpanded)}
                        style={styles.loadMoreContainer}
                    >
                        <Text style={styles.loadMoreText}>
                            {isExpanded ? 'Show less ↑' : 'Load more →'}
                        </Text>
                    </TouchableOpacity>
                )}

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

                {/* Divider - Signals closure */}
                <View style={styles.divider} />

                {/* Footer - Identity comes after meaning */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        — {authorName} · {postDate}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: '#F5F1E8', // Warm vintage paper color
        padding: SPACING.xl,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.lg,
        borderRadius: 16,
        ...SHADOWS.medium,
        shadowColor: '#000',
        shadowOpacity: 0.25, // Stronger shadow for depth
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1.5,
        borderColor: 'rgba(78, 52, 46, 0.25)', // More visible decorative border
    },
    postImage: {
        width: '100%',
        backgroundColor: COLORS.border,
        marginTop: SPACING.md,
    },
    postContent: {
        // No padding needed, handled by postCard
    },
    topDivider: {
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingTop: SPACING.xs,
    },
    decorativeIcon: {
        fontSize: 16,
        color: 'rgba(78, 52, 46, 0.4)',
        fontWeight: '300',
    },
    postTitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 20,
        color: COLORS.primary,
        marginBottom: SPACING.md,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '500', // Lighter weight - let body dominate
    },
    postDescription: {
        ...TYPOGRAPHY.body,
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 27, // ~1.7 line-height for comfortable reading
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: SPACING.sm, // Reduced to make space for load more button
    },
    loadMoreContainer: {
        marginBottom: SPACING.md,
        alignSelf: 'flex-start',
    },
    loadMoreText: {
        ...TYPOGRAPHY.body,
        fontSize: 15,
        color: COLORS.primary,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '600',
        fontStyle: 'italic',
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
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginTop: SPACING.xl, // More space above for breathing room
        marginBottom: SPACING.lg, // More space below too
        opacity: 0.25, // Softer
    },
    footer: {
        alignItems: 'flex-start',
    },
    footerText: {
        ...TYPOGRAPHY.caption,
        fontSize: 12, // Smaller, more subtle
        color: COLORS.textLight,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        opacity: 0.45, // Lower contrast - signature-like
        fontStyle: 'italic',
    },
});
