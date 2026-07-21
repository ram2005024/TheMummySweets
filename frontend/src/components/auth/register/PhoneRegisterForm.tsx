"use client";

import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  phoneRegisterSchema,
  phoneRegisterType,
} from "../../../schemas/auth/RegisterSchema";

const PhoneRegisterForm = () => {
  const phoneRegisterForm = useForm<phoneRegisterType>({
    defaultValues: {
      first_name: "",
      last_name: "",
      mobile_number: "",
      password_1: "",
      password_2: "",
    },
    resolver: zodResolver(phoneRegisterSchema),
  });

  const handlePhoneRegisterForm = (data: phoneRegisterType) => {
    // Combine prefix +977 with user input
    const fullNumber = `+977${data.mobile_number}`;
    console.log({ ...data, fullNumber });
    // later: call backend mutation here
  };

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={phoneRegisterForm.handleSubmit(handlePhoneRegisterForm)}
    >
      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="First name"
            {...phoneRegisterForm.register("first_name")}
          />
          {phoneRegisterForm.formState.errors.first_name && (
            <p className="text-xs text-red-500 mt-1">
              {phoneRegisterForm.formState.errors.first_name.message}
            </p>
          )}
        </div>
        <div>
          <Input
            placeholder="Last name"
            {...phoneRegisterForm.register("last_name")}
          />
          {phoneRegisterForm.formState.errors.last_name && (
            <p className="text-xs text-red-500 mt-1">
              {phoneRegisterForm.formState.errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone input with fixed +977 prefix */}
    <div className="flex items-center gap-2">
  {/* Fixed prefix outside */}
  <span className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 select-none">
    +977
  </span>

  {/* Input only for 10 digits */}
  <Input
    type="tel"
    maxLength={10}
    placeholder="98••••••••"
    {...phoneRegisterForm.register("mobile_number")}
    className="flex-1"
  />
</div>
      {phoneRegisterForm.formState.errors.mobile_number && (
        <p className="text-xs text-red-500 mt-1">
          {phoneRegisterForm.formState.errors.mobile_number.message}
        </p>
      )}

      {/* Password */}
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...phoneRegisterForm.register("password_1")}
        />
        {phoneRegisterForm.formState.errors.password_1 && (
          <p className="text-xs text-red-500 mt-1">
            {phoneRegisterForm.formState.errors.password_1.message}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <Input
          type="password"
          placeholder="Confirm password"
          {...phoneRegisterForm.register("password_2")}
        />
        {phoneRegisterForm.formState.errors.password_2 && (
          <p className="text-xs text-red-500 mt-1">
            {phoneRegisterForm.formState.errors.password_2.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Create account →
      </Button>
    </form>
  );
};

export default PhoneRegisterForm;
