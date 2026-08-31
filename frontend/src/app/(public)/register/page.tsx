"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhoneRegisterForm from "../../../components/auth/register/PhoneRegisterForm";
import EmailRegisterForm from "../../../components/auth/register/EmailRegisterForm";
import Image from "next/image";

export default function Register() {
  let device_id = localStorage.getItem("device_id");
  if (!device_id) {
    device_id = crypto.randomUUID();
    localStorage.setItem("device_id", device_id);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-100 px-5 shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-2">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-3">
            <Image
              src={"/logo.png"}
              height={50}
              width={50}
              className="size-12 rounded-full"
              alt="logo_avatar"
            />
          </div>
          <CardTitle className="text-2xl font-bold font-serif">
            Create your account
          </CardTitle>
          <p className="text-sm text-gray-500">
            Join 1,200+ customers who order from us weekly.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tabs for Phone/Email signup */}
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            {/* Phone signup */}
            <TabsContent value="phone">
              <PhoneRegisterForm />
            </TabsContent>

            {/* Email signup */}
            <TabsContent value="email">
              <EmailRegisterForm />
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-2 text-xs text-gray-400">OR</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          {/* Social signup */}
          <Button
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/google?device_id=${device_id}`)
            }
            variant="outline"
            className="w-full"
          >
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex bg-white flex-col items-center gap-2 text-sm">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Button variant="link" className="p-0 text-orange-500">
              <a href="/login">Sign in</a>
            </Button>
          </p>
          <Button variant="link" className="text-xs text-gray-400 p-0">
            ← Continue browsing
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
