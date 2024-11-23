"use client"

import React from 'react'
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
import { login, signup } from '@/app/(auth)/actions'

import { z } from "zod"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type formType = 'signUp' | 'signIn'

const AuthForm = ({ type }: { type: formType }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)

    try {
      if (type === "signUp") {
        await signup(formData)
      } else {
        await login(formData)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
        <h1 className="form-title">
          {type === "signIn" ? "Sign In" : "Sign Up"}
        </h1>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" placeholder="Enter your email" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Password</FormLabel>
                <FormControl>
                  <Input className="shad-input" type="password" placeholder="Enter your password" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="form-submit-button" type="submit">
          {type === "signIn" ? "Sign In" : "Sign Up"}
        </Button>
      </form>
    </Form>
  )
}

export default AuthForm

