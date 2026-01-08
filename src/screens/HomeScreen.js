import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/theme';

export default function HomeScreen() {
    // Static data for the card
    const cardData = {
        title: 'The Power of Mindfulness',
        author: 'By Thich Nhat Hanh',
        description: 'Mindfulness is the basic human ability to be fully present, aware of where we are and what we’re doing, and not overly reactive or overwhelmed by what’s going on around us.',
        imageUri: 'https://picsum.photos/id/10/800/400', // Reliable nature image
        links: [
            { label: 'Watch on YouTube', url: 'https://www.youtube.com', icon: require('../../assets/youtube-icon.png') },
            { label: 'Follow on Instagram', url: 'https://www.instagram.com', icon: require('../../assets/instagram-icon.png') },
            { label: 'Read Article', url: 'https://www.mindful.org/what-is-mindfulness/', icon: require('../../assets/article-icon.png') }
        ]
    };

    const handleLinkPress = async (url) => {
        // Check if the link is supported
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error(`Don't know how to open this URL: ${url}`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hari Om</Text>
                <Text style={styles.headerSubtitle}>Daily Reflections</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Static Card */}
                <View style={styles.card}>
                    {/* Card Image */}
                    <Image
                        source={{ uri: cardData.imageUri }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />

                    <View style={styles.cardContent}>
                        {/* Card Title */}
                        <Text style={styles.cardTitle}>{cardData.title}</Text>

                        {/* Card Text */}
                        <Text style={styles.cardText}>{cardData.description}</Text>

                        {/* Author Name */}
                        <Text style={styles.authorText}>{cardData.author}</Text>

                        {/* External Links */}
                        <View style={styles.linksContainer}>
                            <Text style={styles.linksHeader}>Additional Resources:</Text>
                            <View style={styles.linkButtonsRow}>
                                {cardData.links.map((link, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.linkButton}
                                        onPress={() => handleLinkPress(link.url)}
                                    >
                                        <Image source={link.icon} style={{ width: 24, height: 24, marginRight: 8, borderRadius: 6 }} resizeMode="contain" />
                                        <Text style={styles.linkButtonText}>{link.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50, // Safe area padding
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.primary,
        fontSize: 28,
    },
    headerSubtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.secondary,
        fontSize: 14,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        ...SHADOWS.medium,
        overflow: 'hidden', // Ensures image respects border radius
        marginBottom: SPACING.lg,
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.border, // Placeholder color while loading
    },
    cardContent: {
        padding: SPACING.md,
    },
    cardTitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 20,
        marginBottom: SPACING.xs,
        color: COLORS.text,
    },
    cardText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        lineHeight: 22,
        marginBottom: SPACING.md,
    },
    linksContainer: {
        marginTop: SPACING.xs,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    linksHeader: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
        marginBottom: SPACING.sm,
        color: COLORS.secondary,
    },
    linkButtonsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    linkButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkButtonText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.background,
        fontWeight: '600',
    },
    authorText: {
        ...TYPOGRAPHY.caption,
        fontStyle: 'italic',
        marginTop: -SPACING.sm,
        marginBottom: SPACING.md,
        color: COLORS.primary,
    },
});
