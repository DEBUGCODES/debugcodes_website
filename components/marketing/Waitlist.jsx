"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {MailIcon, Send} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
export default function WaitlistCard() {
  const [email, setEmail] = useState("");
  return (
      <Card className="border-gray-100 bg-card-white-bg backdrop-blur-sm px-5 w-[40%] flex flex-col justify-between">
        <CardHeader className="text-center">
            <Image src="/logo.png" width={100} height={40} className="mx-auto"/>
          <h1 className="font-extrabold text-2xl text-navy-light">
            Join the waitlist
          </h1>
          <p className="text-sm text-gray-600">
            Enter your email to get notified when the product is launched
          </p>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
          />
        </CardContent>
        <CardFooter className="mx-auto w-full">
            <Button
                variant="outline"
                className="bg-teal-600 text-white w-full hover:bg-teal-700 hover:text-white"
            >
                <Send />
                Join the waitlist
            </Button>
        </CardFooter>
      </Card>
  );
}
