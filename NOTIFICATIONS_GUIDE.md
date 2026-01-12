# Android Notifications for Smriti App

## Overview
This guide explains how to add **local notifications** to your React Native Expo app for Android. When users create a post, they'll see a success notification.

---

## Step 1: Install Dependencies

```bash
npx expo install expo-notifications
```

This installs the Expo notifications package which handles Android (and iOS) notifications.

---

## Step 2: Update `app.json`

Add notification configuration for Android:

```json
{
  "expo": {
    "name": "Smriti",
    "android": {
      "package": "com.kalyan.smriti",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "notification": {
      "icon": "./assets/icon.png",
      "color": "#8B7355",
      "androidMode": "default",
      "androidCollapsedTitle": "Smriti"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#8B7355"
        }
      ]
    ]
  }
}
```

**What this does:**
- Sets notification icon (uses your app icon)
- Sets notification color (brownish/spiritual theme)
- Configures Android-specific settings

---

## Step 3: Configure Notification Handler in `App.js`

Add this at the top of your `App.js`:

```javascript
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

Then in your `App` component, add permission request:

```javascript
export default function App() {
  // ... existing state ...

  React.useEffect(() => {
    registerForPushNotificationsAsync();
    checkExistingAuth();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B7355',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions');
      return;
    }
  }

  // ... rest of component
}
```

**What this does:**
- Creates a notification channel for Android (required for Android 8+)
- Requests notification permissions from user
- Configures vibration and color

---

## Step 4: Trigger Notification in `CreatePostScreen.js`

Import the notifications package:

```javascript
import * as Notifications from 'expo-notifications';
```

Then in your `handleSave` function, after successful API call:

```javascript
const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
        Alert.alert('Incomplete', 'Please fill in both title and description');
        return;
    }

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
                    title: "✨ Reflection Saved!",
                    body: `"${title.trim()}" has been saved to your reflections.`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    vibrate: [0, 250, 250, 250],
                },
                trigger: null, // Show immediately
            });

            Alert.alert('Success', 'Your reflection has been saved!');
            onSave(result.post);
        } else {
            Alert.alert('Error', result.error || 'Failed to save post. Please try again.');
        }
    } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        console.error('Error in handleSave:', error);
    } finally {
        setLoading(false);
    }
};
```

**What this does:**
- Schedules a notification immediately after successful post creation
- Shows post title in notification
- Uses high priority for Android
- Includes vibration pattern

---

## Step 5: Rebuild for Android

After making these changes:

```bash
# Clean and rebuild native code
npx expo prebuild --platform android --no-install --clean

# Build APK
npx eas-cli build -p android --profile preview
```

---

## How It Works

### When app is in foreground:
- User creates a post
- Notification appears at top of screen
- Plays sound and vibrates
- Can be expanded to see full message

### When app is in background:
- Notification appears in status bar
- User can tap to open app

---

## Customization Options

### Change Notification Sound
```javascript
sound: 'default', // or custom sound file
```

### Change Priority
```javascript
priority: Notifications.AndroidNotificationPriority.MAX, // MAX, HIGH, DEFAULT, LOW, MIN
```

### Add Action Buttons
```javascript
content: {
    title: "✨ Reflection Saved!",
    body: `"${title}" has been saved.`,
    data: { postId: result.post.postId },
},
```

### Different Notification Channels
Create separate channels for different types of notifications:

```javascript
await Notifications.setNotificationChannelAsync('posts', {
    name: 'Post Notifications',
    importance: Notifications.AndroidImportance.HIGH,
});

await Notifications.setNotificationChannelAsync('reminders', {
    name: 'Daily Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
});
```

---

## Testing

1. **Test in Expo Go:**
   - Run `npx expo start`
   - Scan QR code with Expo Go
   - Create a post
   - Should see notification

2. **Test in APK:**
   - Build APK with EAS
   - Install on device
   - Create a post
   - Should see notification with custom icon/color

---

## Common Issues

### Notifications not showing?
- Check if permissions were granted
- Ensure Android notification channel is created
- Check device notification settings

### Sound not playing?
- Check device is not in silent mode
- Verify `sound: true` is set in notification content

### Wrong icon showing?
- Ensure icon path in `app.json` is correct
- Icon should be PNG, not JPEG
- Rebuild app after icon changes

---

## Summary

✅ **Simple implementation** - Just 4 code changes
✅ **No backend required** - Works purely on device
✅ **Great user feedback** - Confirms post was saved
✅ **Android optimized** - Uses notification channels, sounds, vibration

**Total implementation time:** ~15-20 minutes
