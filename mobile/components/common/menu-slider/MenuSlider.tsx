import React, { useEffect, useRef, useState } from 'react'
import { Text, Animated, Dimensions, PanResponder, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    menu: {
        backgroundColor: 'lightgrey',
        width: 100,
        height: '100%',
        position: 'absolute',
        left: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuItem: {
        fontSize: 18,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const { width } = Dimensions.get('window');
const MenuSlider = ({ signOut, menuOpen, setMenuOpen }) => {
    const pan = useRef(new Animated.ValueXY({ x: -width, y: 0 })).current; // Start from left (hidden)
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dx > width / 2) {
                    // Open the menu
                    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
                    setMenuOpen(true);
                } else {
                    // Close the menu
                    Animated.spring(pan, { toValue: { x: -width, y: 0 }, useNativeDriver: false }).start();
                    setMenuOpen(false);
                }
            }
        })
    ).current;


    if (menuOpen === null) return
    if (menuOpen) {
        Animated.spring(pan, { toValue: { x: -width, y: 0 }, useNativeDriver: false }).start();
    } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    }

    return <Animated.View
        style={[
            styles.menu,
            {
                transform: [
                    { translateX: pan.x }
                ]
            }
        ]}
        {...panResponder.panHandlers}
    >
        <Text style={styles.menuItem}>Menu Item 1</Text>
        <Text style={styles.menuItem}>Menu Item 2</Text>
        <Text style={styles.menuItem} onPress={async () => {
            try {
                setMenuOpen(false);
                await signOut();

                // Navigate after signing in. You may want to tweak this to ensure sign-in is
                // successful before navigating.
                //router.replace("/(app)/(drawer)/dashboard");
            } catch (error) {
                // Alert.alert("Sign In Error", (error as any)?.message);
            }
        }}>Logout</Text>
        {/* Add more menu items as needed */}
    </Animated.View>
}

export default MenuSlider
