import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, FlatList, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/theme';
import { getPosts } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ onCreatePost, onLogout }) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadPosts();
        loadUser();
    }, []);

    const loadPosts = async () => {
        const loadedPosts = await getPosts();
        setPosts(loadedPosts);
    };

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user_data');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleLogoutPress = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: onLogout, style: 'destructive' }
            ]
        );
    };

    // Static data for the featured card
    const cardData = {
        title: 'The Power of Mindfulness',
        author: 'By Thich Nhat Hanh',
        description: 'Mindfulness is the basic human ability to be fully present, aware of where we are and what we’re doing, and not overly reactive or overwhelmed by what’s going on around us.',
        imageUri: 'https://picsum.photos/id/10/800/400',
        links: [
            { label: 'Watch on YouTube', url: 'https://www.youtube.com', icon: require('../../assets/youtube-icon.png') },
            { label: 'Follow on Instagram', url: 'https://www.instagram.com', icon: require('../../assets/instagram-icon.png') },
            { label: 'Read Article', url: 'https://www.mindful.org/what-is-mindfulness/', icon: require('../../assets/article-icon.png') }
        ]
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

                    <View style={styles.headerActions}>
                        {user && (
                            <View style={styles.userInfo}>
                                <View style={styles.userIcon}>
                                    <Text style={styles.userInitial}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <Text style={styles.usernameText}>{user.username}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Daily Inspiration</Text>
                <View style={styles.card}>
                    <Image
                        source={{ uri: cardData.imageUri }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />

                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{cardData.title}</Text>
                        <Text style={styles.cardText}>{cardData.description}</Text>
                        <Text style={styles.authorText}>{cardData.author}</Text>

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
            </View>

            {posts.length > 0 && <Text style={[styles.sectionTitle, { paddingHorizontal: SPACING.md }]}>My Reflections</Text>}
        </View>
    );

    const renderPostItem = ({ item }) => (
        <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDate}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.postDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item.id || item.date}
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
    postDate: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textLight,
        marginBottom: 8,
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
