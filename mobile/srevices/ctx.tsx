import React, { useEffect, useState, createContext } from "react";
import { login, logout, createAccount, getCurrentUser } from './service'
import { User } from './types'
import { Alert } from 'react-native'


const AuthContext = createContext<{
    signIn: (
        email: string,
        password: string
    ) => Promise<User | undefined> | undefined;
    signUp: (
        email: string,
        password: string,
        name?: string
    ) => Promise<User | undefined> | undefined;
    signOut: () => void;
    isLoading: boolean;
    user?: User | undefined;
}>({
    signIn: async () => undefined,
    signUp: async () => undefined,
    signOut: async () => null,
    isLoading: false,
    user: undefined,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error("useSession must be wrapped in a <SessionProvider />");
        }
    }

    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        /**
         * Initialize the component
         */
        async function init() {
            try {
                const response = await getCurrentUser();
                setUser(response?.data?.user!);
                setIsLoading(false);
            } catch (e) {
                console.log("[error getting user] ==>", e);
                setIsLoading(false);
            }
        }
        init();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email: string, password: string) => {
                    try {
                        // Perform sign-in logic here
                        const response = await login(email, password);
                        if (response?.error) {
                            throw response?.error
                        }
                        if (!response?.user) {
                            return undefined // user not found
                        }

                        setUser(response?.user!)
                        setIsLoading(false)

                        return response.user
                    } catch (error) {
                        // Alert.alert(error.name, error.message)
                        return undefined
                    }
                },
                signUp: async (name: string, email: string, password: string) => {
                    // Perform sign-up logic here
                    const response = await createAccount(name, email, password);
                    setUser(response?.user!);
                    setIsLoading(false);
                    return response.user;
                },
                signOut: async () => {
                    // Perform sign-out logic here
                    await logout();
                    setUser(undefined);
                    setIsLoading(false);
                },
                isLoading,
                user,
            }
            }
        >
            {props.children}
        </AuthContext.Provider >
    );
}