"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PhoneLoginForm from "../../components/auth/login/PhoneLoginForm";
import EmailLoginForm from "../../components/auth/login/EmailLoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-90 shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-2">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full  flex items-center justify-center">
             <Image src={"/logo.jpg"} height={20} width={20} className="size-12 rounded-full" alt="logo_avatar"/>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
          <p className="text-sm text-gray-500">
            Sign in to track orders, save favourites and earn loyalty points.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tabs for Phone/Email login */}
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            {/* Phone login */}
            <TabsContent value="phone" >
                <PhoneLoginForm/>
            </TabsContent>

            {/* Email login */}
            <TabsContent value="email" >
              <EmailLoginForm/>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-2 text-xs text-gray-400">OR</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          {/* Social login */}
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2 text-sm">
          <p className="text-gray-500">
            New here?{" "}
            <Button variant="link" className="p-0 text-orange-500">
              <a href="/register">Create an account</a>
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
