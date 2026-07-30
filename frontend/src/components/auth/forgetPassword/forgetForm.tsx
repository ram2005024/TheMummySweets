"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ForgotByEmail from "./forgetByEmail";
import ForgotByPhone from "./forgetByPhone";



export default function ForgotPasswordCard() {
    return (
        <div className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-lg">

            <div className="mb-6 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                    🔐
                </div>

                <h1 className="text-2xl font-bold">
                    Forgot Password
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Choose how you&apos;d like to reset your password.
                </p>

            </div>

            <Tabs defaultValue="email">

                <TabsList className="grid w-full grid-cols-2">

                    <TabsTrigger value="email">
                        Email
                    </TabsTrigger>

                    <TabsTrigger value="phone">
                        Phone
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="email">
                    <ForgotByEmail />
                </TabsContent>

                <TabsContent value="phone">
                    <ForgotByPhone />
                </TabsContent>

            </Tabs>

        </div>
    );
}
