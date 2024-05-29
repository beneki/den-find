import { useState } from 'react';
import { Text, TextInput, View, ScrollView, SafeAreaView, Button } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

import { COLORS, icons, images, SIZES } from '../../../constants';
import styles from './LoginBox.style'

const LoginBox = ({ login, logout }) => {
    const router = useRouter()
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        // Handle the login logic here
        // Alert.alert('Login Data', `Username: ${data.username}, Password: ${data.password}`);

        const result = login()
        if (result) router.push('/')
    };

    return <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="username"
                defaultValue=""
            />
            {errors.username && <Text style={styles.error}>This field is required.</Text>}

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
                defaultValue=""
            />
            {errors.password && <Text style={styles.error}>This field is required.</Text>}

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
    </SafeAreaView>
}

export default LoginBox;