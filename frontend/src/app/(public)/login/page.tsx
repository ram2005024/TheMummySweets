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
import Image from "next/image";
import PhoneLoginForm from "../../../components/auth/login/PhoneLoginForm";
import EmailLoginForm from "../../../components/auth/login/EmailLoginForm";
import { useRouter } from "next/navigation";

export default function Login() {
  let device_id = localStorage.getItem("device_id");
  if (!device_id) {
    device_id = crypto.randomUUID();
    localStorage.setItem("device_id", device_id);
  }
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-100 shadow-lg rounded-xl px-5">
        <CardHeader className="text-center space-y-2">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full  flex items-center justify-center">
              <Image
                src={"/logo.png"}
                height={50}
                width={50}
                className="size-12 rounded-full"
                alt="logo_avatar"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-serif">
            Welcome back
          </CardTitle>
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
            <TabsContent value="phone">
              <PhoneLoginForm />
            </TabsContent>

            {/* Email login */}
            <TabsContent value="email">
              <EmailLoginForm />
            </TabsContent>
          </Tabs>
          {/* Forget password section */}
          <div className="flex justify-end">
            <Button
              variant="link"
              onClick={() => router.push("/forget")}
              className="text-xs text-gray-500"
            >
              Forgot password?
            </Button>
          </div>
          {/* Divider */}
          <div className="flex items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-2 text-xs text-gray-400">OR</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          {/* Social login */}
          <Button
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/google?device_id=${device_id}`)
            }
            variant="outline"
            className="w-full cursor-pointer"
          >
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2 text-sm bg-white">
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
