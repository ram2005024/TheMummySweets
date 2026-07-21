import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { emailRegisterSchema, emailRegisterType } from "../../../schemas/auth/RegisterSchema";

const EmailRegisterForm = () => {
  const emailRegisterForm = useForm<emailRegisterType>({
    defaultValues: {
      email: "",
      password_1: "",
      password_2: "",
      first_name: "",
      last_name: "",
    },
    resolver: zodResolver(emailRegisterSchema),
  });

  const handleEmailRegisterForm = (data: emailRegisterType) => {
    console.log(data);
  };

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={emailRegisterForm.handleSubmit(handleEmailRegisterForm)}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="First name"
            {...emailRegisterForm.register("first_name")}
          />
          {emailRegisterForm.formState.errors.first_name && (
            <p className="text-xs text-red-500 mt-1">
              {emailRegisterForm.formState.errors.first_name.message}
            </p>
          )}
        </div>
        <div>
          <Input
            placeholder="Last name"
            {...emailRegisterForm.register("last_name")}
          />
          {emailRegisterForm.formState.errors.last_name && (
            <p className="text-xs text-red-500 mt-1">
              {emailRegisterForm.formState.errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          placeholder="you@example.com"
          {...emailRegisterForm.register("email")}
        />
        {emailRegisterForm.formState.errors.email && (
          <p className="text-xs text-red-500 mt-1">
            {emailRegisterForm.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          {...emailRegisterForm.register("password_1")}
        />
        {emailRegisterForm.formState.errors.password_1 && (
          <p className="text-xs text-red-500 mt-1">
            {emailRegisterForm.formState.errors.password_1.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="password"
          placeholder="Confirm password"
          {...emailRegisterForm.register("password_2")}
        />
        {emailRegisterForm.formState.errors.password_2 && (
          <p className="text-xs text-red-500 mt-1">
            {emailRegisterForm.formState.errors.password_2.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Create account →
      </Button>
    </form>
  );
};

export default EmailRegisterForm;
