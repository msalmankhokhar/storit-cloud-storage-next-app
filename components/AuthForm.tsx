"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createAccount, loginUser } from "@/lib/actions/user.actions"
import OtpModal from "./OtpModal"



interface AuthFormProps {
    type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
    
    const formSchema = z.object({
        fullName: type === 'signup' ? z.string().min(2).max(50) : z.string().optional(),
        email: z.string().email(),
    })
    
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [accountId, setAccountId] = useState(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: type === 'signup' ? "" : undefined,
            email: ""
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setLoading(true);
        setErrorMessage('');
        try {
            const user = type === 'login' ? 
            await loginUser({email: values.email}) : 
            await createAccount({fullName: values.fullName || '', email: values.email || ''});
            setAccountId(user.accountId);
        } catch (error) {
            setErrorMessage('Failed to create and account. Please try again');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                    <h1 className="form-title">
                        {type === 'login' ? 'Log In' : 'Create Account'}
                    </h1>
                    {
                        type === 'signup' ? (
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="shad-form-item">
                                            <FormLabel className="shad-form-label">Full Name</FormLabel>
                                            <FormControl>
                                                <Input className="shad-input" placeholder="Your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        ) : ''
                    }
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">Email</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input" placeholder="Your Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} className="form-submit-button" type="submit">
                        <span>{type === 'login' ? 'Log In' : 'Sign Up'}</span>
                        {
                            loading && (
                                <Image
                                    alt="spinner"
                                    src={'/jsm-assets/icons/loader.svg'}
                                    width={24}
                                    height={24}
                                    className="ml-2 animate-spin"
                                />
                            )
                        }
                    </Button>

                    {
                        errorMessage && (
                            <p className="error-message">*{errorMessage}</p>
                        )
                    }

                    <div className="body-2 flex justify-center">
                        <p className="text-light-100">
                            {
                                type === 'login' ?
                                    `Don't have an account?` : 'Already have an aacount?'
                            }
                        </p>
                        <Link className="ml-1 font-medium text-brand" href={type === 'login' ? '/signup' : '/login'}>
                            {
                                type === 'login' ?
                                    `Create an Account` : 'Log in here'
                            }
                        </Link>
                    </div>
                </form>
            </Form>
            {
                accountId && (
                    <OtpModal 
                        email={form.getValues('email')} 
                        accountId={accountId}
                    />
                )
            }
        </>
    )
}
