"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "../../../utils/supabaseClient";

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  profession: z.string().min(2).max(50),
});

const AddDocsRoom = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      profession: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.from("dessly").insert([values]);

      if (error) {
        console.log(error);
        setFormError("Please fill in all the fields correctly.");
      } else {
        console.log(data);
        setFormError(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setFormError("An unexpected error occurred.");
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="shad-form-item">
                <FormLabel className="shad-form-label">FullName</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    placeholder="EX: Oualid Elhouari"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem className="shad-form-item">
                <FormLabel className="shad-form-label">Profession</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    placeholder="EX: Web Dev"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="primary-btn w-full text-white h-[66px]"
            type="submit"
          >
            Add Doc
          </Button>
        </form>
      </Form>
      {formError && <p className="text-red-500 mt-4">{formError}</p>}
    </div>
  );
};

export default AddDocsRoom;