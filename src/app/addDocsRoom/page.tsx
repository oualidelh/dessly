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
import { supabase } from "../../../utils/supabase/supabaseClient";
import useStore from "../store";

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  profession: z.string().min(2).max(50),
});

function WhoIsHere() {
  const othersUsersCount = useStore((state) => state.liveblocks.others);

  othersUsersCount.map((user) =>{
    return console.log(user.info)
  })


  return (
    <div className="who_is_here">
      There are {othersUsersCount.length} other users online
    </div>
  );
}

function SomeoneIsTyping({ field }: { field: "isTypingFullName" | "isTypingProfession" }) {
  const others = useStore((state) => state.liveblocks.others);

  const someoneIsTyping = others.some((user) => user.presence?.[field]);

  console.log("someone", someoneIsTyping)

  if (!someoneIsTyping) return null;

  return (
    <div className="someone_is_typing">
      Someone is typing in {field === "isTypingFullName" ? "Full Name" : "Profession"} field
    </div>
  );
}

const AddDocsRoom = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    fullName,
    setFullName,
    profession,
    setProfession,
    liveblocks: { enterRoom, leaveRoom, },
  } = useStore();

  console.log("fullname", profession)

  useEffect(() => {
    enterRoom("zustand-add-doc");
    return () => {
      leaveRoom();
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
        setFullName("");
        setProfession("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setFormError("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-white p-5 max-w-lg mx-auto rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">FullName</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e); 
                    setFullName(e.target.value); 
                  }}
                  value={fullName} 
        
                    className="w-full p-2 border placeholder:text-gray-400 font-semibold border-gray-300 rounded-md mb-5"
                    placeholder="EX: Oualid Elhouari" 
                  />
                </FormControl>
                <SomeoneIsTyping field="isTypingFullName" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">Profession</FormLabel>
                <FormControl>
                  <Input
                    className="w-full p-2 placeholder:text-gray-400 font-semibold border border-gray-300 rounded-md mb-5"
                    placeholder="EX: Web Dev"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Let React Hook Form handle value updates
                      setProfession(e.target.value); // Update the Zustand state or perform any custom logic
                    }}
                    value={profession}
                  />
                </FormControl>
                <SomeoneIsTyping field="isTypingProfession" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="bg-brand text-white hover:bg-brand-100 rounded-lg py-2 px-3 font-poppins cursor-pointer"
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