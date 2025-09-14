import { useState } from "react";

export function useAuth() {

    const [error, setError] = useState<any>(null);
    const signIn = async (data: { email: string, password: string }) => {

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data }),
                    credentials: 'include', // << important!
                });
            const result = await response.json();
            return result
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }

    const signUp = async (data: { name: string, email: string, password: string }) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data }),
                });
            const result = await response.json();
            console.log("register result: ", result)
            return result
        } catch (error: any) {
            setError(error.message)
        }
    }


    const forgotPassowrd = async (email: string, newPassword: string) => {
        try {
            const response = await fetch('/api/auth',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, newPassword }),
                });
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }

    const logout = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/auth/logout',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            const res = await response.json();
            console.log("logOut: ", res)
            return res;
        } catch (error) {
            console.error('Error sign out:', error);
        }
    }
    return { signIn, signUp, forgotPassowrd, error, logout };
}
