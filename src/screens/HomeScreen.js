import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    AppState,
    Platform,
    ImageBackground,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../styles/theme';
import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components';

export default function HomeScreen({ onCreatePost }) {
    const { posts, refreshing, refreshPosts } = usePosts();
    const appState = useRef(AppState.currentState);
    const [showSmritiModal, setShowSmritiModal] = useState(false);

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
        description: 'Smriti is a quiet digital space to pause, reflect, and remember. There are no likes, comments, or noise here.\n\nOnly sincere learnings, gentle reminders, and shared reflections.',
        imageUri: require('../../assets/daily_inspiration.png'),
        author: 'Reflections',
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

    const renderScrollableHeader = () => null;

    return (
        <ImageBackground
            source={require('../../assets/bg_home_page.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            {/* Fixed Header */}
            <ImageBackground
                source={require('../../assets/bg_home_page.jpg')}
                style={styles.fixedHeader}
                resizeMode="cover"
                imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
            >
                {/* Overlay to modify background tone */}
                <View style={[StyleSheet.absoluteFill, {
                    backgroundColor: 'rgba(141, 110, 99, 0.1)', // Light brown tint 
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                }]} />

                <View style={styles.headerTopRow}>
                    <TouchableOpacity
                        style={styles.appIconContainer}
                        onPress={() => setShowSmritiModal(true)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../../assets/icon.png')}
                            style={styles.appIcon}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerSubtitle}>Daily Reflections</Text>
                    </View>
                </View>
            </ImageBackground>

            <PostList
                posts={posts}
                onRefresh={refreshPosts}
                refreshing={refreshing}
                ListHeaderComponent={renderScrollableHeader}
                contentContainerStyle={styles.scrollContent}
            />

            {/* Smriti Modal Popup */}
            <Modal
                visible={showSmritiModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSmritiModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSmritiModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalContent}>
                            <ImageBackground
                                source={require('../../assets/bg_card.jpg')}
                                style={styles.card}
                                resizeMode="cover"
                                imageStyle={{ borderRadius: 20 }}
                            >
                                <View style={styles.cardImageContainer}>
                                    <Image
                                        source={cardData.imageUri}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.cardOverlay} />
                                </View>

                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{cardData.title}</Text>

                                    {cardData.author && (
                                        <View style={styles.authorContainer}>
                                            <Text style={styles.authorText}>{cardData.author}</Text>
                                        </View>
                                    )}

                                    <Text style={styles.cardText}>{cardData.description}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.background, // Handled by ImageBackground
        // paddingTop: 50, // Removed, handled by Fixed Header padding
    },
    fixedHeader: {
        paddingTop: Platform.OS === 'ios' ? 45 : 28, // Further reduced
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.sm, // Further reduced
        zIndex: 10,
        ...SHADOWS.medium, // Add shadow for depth
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.15,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    appIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        marginRight: SPACING.md,
        ...SHADOWS.small,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.2,
        backgroundColor: COLORS.card,
        borderWidth: 2,
        borderColor: 'rgba(78, 52, 46, 0.15)',
    },
    appIcon: {
        width: '100%',
        height: '100%',
    },
    headerSubtitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.primary,
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
    },
    scrollContent: {
        paddingBottom: 20, // Space for bottom tab bar
    },
    sectionContainer: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.lg,
    },
    feedHeader: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.heading,
        color: COLORS.secondary,
        fontSize: 20,
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    sectionDivider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
        opacity: 0.2, // Much softer, less competing
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        ...SHADOWS.medium,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.1,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(78, 52, 46, 0.2)', // Increased visibility
    },
    cardImageContainer: {
        position: 'relative',
        height: 220,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.border,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.02)', // Subtle tint
    },
    cardContent: {
        padding: SPACING.lg,
        paddingTop: SPACING.md, // Reduced slightly
        alignItems: 'center', // Center everything in content
    },
    cardTitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 24,
        marginBottom: SPACING.xs,
        color: COLORS.primary,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '700',
        textAlign: 'center',
    },
    cardText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        lineHeight: 28, // Increased for center alignment readability
        fontSize: 16,
        opacity: 0.9,
        marginBottom: SPACING.lg,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        textAlign: 'center',
    },
    authorContainer: {
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        borderRadius: 20,
        // backgroundColor: 'rgba(255,255,255,0.5)', // Optional subtle background for pill
    },
    authorText: {
        ...TYPOGRAPHY.caption,
        fontStyle: 'italic',
        color: COLORS.secondary,
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
    },
});
