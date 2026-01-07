# Smriti App: Beginner's Guide

This guide explains how the Smriti app is built, structured, and how the Sign Up page works. It is designed for someone with no prior programming knowledge to understand the basics of this application.

## 1. How the App Was Created

The app was built using a framework called **Expo**. Expo is a set of tools built on top of **React Native**, which basically allows us to write mobile apps (for both Android and iOS) using JavaScript—the same language used for websites.

Think of it like building a house:
- **React Native** is the bricks and mortar.
- **Expo** is the toolkit (cranes, blueprints, pre-made frames) that makes building the house much faster and easier.

To start this project, we essentially ran a command that said "Create a new Expo project for me," which set up all the necessary files and folders automatically.

## 2. Project Structure (The "House" Blueprint)

Here is a simplified view of the important folders and files in the project and what they do:

```text
SmritiApp/              <-- The main project folder
├── App.js              <-- The Front Door. This is the first file the app reads.
├── app.json            <-- The ID Card. Contains settings like the app name and icon.
├── src/                <-- The "Source" folder. All our custom code lives here.
│   ├── screens/        <-- The Rooms. Each "screen" (page) of the app goes here.
│   │   └── AuthScreen.js   <-- The Sign Up / Login screen.
│   ├── services/       <-- The Workers. Code that does heavy lifting like saving data.
│   │   └── storage.js      <-- Handles saving user info to the phone's memory.
│   ├── styles/         <-- The Decor. Colors, fonts, and spacing rules.
│   │   └── theme.js        <-- Defines our focused color palette (e.g., green for spiritual).
│   └── utils/          <-- The Tools. Helper functions.
│       └── crypto.js       <-- Helper to secure (hash) passwords.
└── package.json        <-- The Instruction Manual. Lists all the external libraries we use.
```

## 3. The Sign Up Page (Deep Dive)

The Sign Up page is located in `src/screens/AuthScreen.js`. It's built using **React Components**. You can think of a component as a LEGO block. We combine smaller blocks (Text, Inputs, Buttons) to build the full page.

### How it Works (Step-by-Step)

1.  **State Management (The Brain)**:
    -   The app needs to "remember" what you type. We use `useState` for this.
    -   Imagine three little boxes inside the app's memory: one for `username`, one for `password`, and one for `confirmPassword`.
    -   Every time you type a letter, the app updates the corresponding box.

2.  **Display (The Face)**:
    -   **`View`**: Like a `div` in HTML or a box. It holds other elements.
    -   **`Text`**: Displays text (like "Create Account").
    -   **`TextInput`**: The box where you type your username and password.
    -   **`TouchableOpacity`**: The "Sign Up" button. We call it "touchable" because it responds when you touch it.

3.  **Validation (The Bouncer)**:
    -   Before letting you sign up, the code checks a few things:
        -   Is the username empty?
        -   Is the password too short (less than 6 characters)?
        -   Do the password and confirm password match?
    -   If any of these fail, it shows an `Alert` (a pop-up message) and stops.

4.  **Saving Data (The Storage)**:
    -   If everything looks good, the app prepares your data.
    -   **Security**: It doesn't save your password directly. It "hashes" it (scrambles it) using `crypto.js` so it's secure.
    -   **Saving**: It calls `saveUser` from `storage.js`.
    -   `storage.js` uses `AsyncStorage`, which is like a tiny database on your phone itself. It saves your user info there permanently, so it's still there when you close and open the app.

### Visual Breakdown of `AuthScreen.js`

Here is a simplified explanation of the code segments:

**The Imports:**
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput... } from 'react-native';
// ... bringing in the tools we need
```
*This is like gathering ingredients before cooking.*

**The Component Logic:**
```javascript
export default function AuthScreen() {
    // 1. The Variables (State)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 2. The Logic (What happens when you press Sign Up)
    const handleSignUp = async () => {
        // ... checks inputs ...
        // ... saves data ...
    };

    // 3. The Visuals (what you see)
    return (
        <View>
            <Text>Smriti</Text>
            <TextInput value={username} onChangeText={setUsername} ... />
            <Button onPress={handleSignUp} title="Sign Up" />
        </View>
    );
}
```

## Summary for a Non-Tech Person

1.  We used **Expo** to quickly set up a professional mobile app structure.
2.  We organized our code into folders: **screens** (what you see), **services** (what the app does in the background), and **styles** (how it looks).
3.  The **Sign Up Page** is a "Smart Form". It watches what you type, makes sure you didn't make mistakes (like a short password), scrambles your password for safety, and saves your new account directly to your phone's storage.
