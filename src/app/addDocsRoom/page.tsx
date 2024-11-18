"use client";
import React, { useEffect, useState } from "react";
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
import useStore from "../store";

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  profession: z.string().min(2).max(50),
});

function WhoIsHere() {
  const othersUsersCount = useStore((state) => state.liveblocks.others.length);

  return (
    <div className="who_is_here">
      There are {othersUsersCount} other users online
    </div>
  );
}

function SomeoneIsTyping() {
  const others = useStore((state) => state.liveblocks.others);

  const someoneIsTyping = others.some((user) => user.presence.isTyping);

  return someoneIsTyping ? (
    <div className="someone_is_typing">Someone is typing</div>
  ) : null;
}

const AddDocsRoom = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    fullName,
    setFullName,
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  console.log("fullname", fullName)

  useEffect(() => {
    enterRoom("zustand-add-doc");
    return () => {
      leaveRoom("zustand-add-doc");
    };
  }, [enterRoom, leaveRoom]);
  
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
                  {...field}
                  onChange={(e) => {
                    field.onChange(e); // Let React Hook Form handle value updates
                    setFullName(e.target.value); // Update the Zustand state or perform any custom logic
                  }}
                  value={fullName} // Ensure the input reflects the controlled value
        
                    className="shad-input"
                    placeholder="EX: Oualid Elhouari" 
                  />
                </FormControl>
                <SomeoneIsTyping />
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
      <WhoIsHere />
    </div>
  );
};

export default AddDocsRoom;