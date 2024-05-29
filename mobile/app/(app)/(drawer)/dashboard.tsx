import { useState, useRef } from 'react';
import { Alert, View, Text, ScrollView, SafeAreaView, Animated, Dimensions, PanResponder, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { COLORS, icons, images, SIZES } from '../../../constants';
import { Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome } from '../../../components'
import { useSession } from '../../../srevices/ctx';
import MenuSlider from './../../../components/common/menu-slider/MenuSlider'


const Main = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const { signOut } = useSession();
    const [menuOpen, setMenuOpen] = useState(null);

    return <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <View style={{ flex: 1 }}>
            <MenuSlider signOut={signOut} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" handlePress={() => setMenuOpen(!menuOpen)} />
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn iconUrl={images.profile} dimension="100%" handlePress={() => { }} />
                    ),
                    headerTitle: ""
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: SIZES.medium }}>
                    <Welcome
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleClick={() => {
                            if (searchTerm) {
                                router.push(`/search/${searchTerm}`)
                            }
                        }}
                    />
                    <Popularjobs />
                    <Nearbyjobs />
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
}

export default Main;