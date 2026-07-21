"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhoneRegisterForm from "../../components/auth/register/PhoneRegisterForm";
import EmailRegisterForm from "../../components/auth/register/EmailRegisterForm";

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-90 shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-2">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-600">Logo</span>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">Create your account</CardTitle>
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
            <TabsContent value="phone" >
              <PhoneRegisterForm/>
            </TabsContent>

            {/* Email signup */}
            <TabsContent value="email" >
              <EmailRegisterForm/>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-2 text-xs text-gray-400">OR</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          {/* Social signup */}
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2 text-sm">
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
