import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, AppState } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/theme';
import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components';

export default function HomeScreen({ onCreatePost }) {
    const { posts, refreshing, refreshPosts } = usePosts();
    const appState = useRef(AppState.currentState);

    // Auto-refresh when app comes to foreground
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground! Refreshing posts...');
                refreshPosts();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [refreshPosts]);

    // Static data for the featured card
    const cardData = {
        title: '🌱 Why Smriti exists?',
        description: 'Smriti is a quiet digital space to pause, reflect, and remember. There are no likes, comments, or noise here.Only sincere learnings, gentle reminders, and shared reflections.',
        imageUri: require('../../assets/daily_inspiration.png'),

        links: []
    };

    const handleLinkPress = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error(`Don't know how to open this URL: ${url}`);
        }
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <View style={styles.headerTopRow}>
                    <View>
                        <Text style={styles.headerTitle}>Hari Om</Text>
                        <Text style={styles.headerSubtitle}>Daily Reflections</Text>
                    </View>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.card}>
                    <Image
                        source={cardData.imageUri}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />

                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{cardData.title}</Text>
                        <Text style={styles.cardText}>{cardData.description}</Text>
                        <Text style={styles.authorText}>{cardData.author}</Text>
                    </View>
                </View>
            </View>

            {posts.length > 0 && <Text style={[styles.sectionTitle, { paddingHorizontal: SPACING.md }]}>Reflections</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <PostList
                posts={posts}
                onRefresh={refreshPosts}
                refreshing={refreshing}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.scrollContent}
            />

            {/* FAB (Floating Action Button) */}
            <TouchableOpacity style={styles.fab} onPress={onCreatePost}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    logoutButton: {
        padding: 6,
    },
    logoutText: {
        ...TYPOGRAPHY.caption,
        color: '#ff4444', // Red for logout
        fontWeight: '600',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        ...SHADOWS.small,
    },
    userIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    userInitial: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: 'bold',
    },
    usernameText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text,
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: 80, // Space for FAB
    },
    sectionContainer: {
        padding: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.heading,
        color: COLORS.secondary,
        marginBottom: SPACING.sm,
        fontSize: 18,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        ...SHADOWS.medium,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.border,
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
    authorText: {
        ...TYPOGRAPHY.caption,
        fontStyle: 'italic',
        marginTop: -SPACING.sm,
        marginBottom: SPACING.md,
        color: COLORS.primary,
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
    // New Styles for Posts and FAB
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
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    fabText: {
        fontSize: 32,
        color: COLORS.background,
        paddingBottom: 4, // Visual alignment
    },
});
