"use client"
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailRegisterSchema,
  emailRegisterType,
} from "../../../schemas/auth/RegisterSchema";
import Image from "next/image";
import { useRegisterEmail } from "../../../hooks/auth/useRegister";
import { UnauthenticatedDialog } from "../login/UnauthenticatedDialog";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../type/common.type";

const EmailRegisterForm = () => {
    const registerEmail=useRegisterEmail()
    const [user_id,setUserID]=useState<string>("")
    const [open,setOpen]=useState<boolean>(false)
  const emailRegisterForm = useForm<emailRegisterType>({
    defaultValues: {
      email: "",
      password_1: "",
      password_2: "",
      first_name: "",
      last_name: "",
      image: undefined, // optional
    },
    resolver: zodResolver(emailRegisterSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleEmailRegisterForm = (data: emailRegisterType) => {
    registerEmail.mutate(data,{
      onSuccess:(data)=>{
        if(data.data.user_id){
          setUserID(data.data.user_id)
          setOpen(true)
        }
      }
    })
  };

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={emailRegisterForm.handleSubmit(handleEmailRegisterForm)}
    >
      {/* If the register is succeed then  */}
            {open && user_id && <UnauthenticatedDialog data={{field_value:emailRegisterForm.getValues("email"),field_name:"email",user_id:user_id}} onSuccessURL="/login" onClose={()=>setOpen(false)} open={open}/>}
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

      {/* Image Upload with Preview + Delete */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Profile Image (optional)
        </label>

        {!preview ? (
          <Input
            type="file"
            accept="image/*"
            {...emailRegisterForm.register("image")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                emailRegisterForm.setValue("image", file);
              }
            }}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:px-3 file:text-center
                       file:rounded-md file:border-0
                       file:text-xs file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 border-0"
          />
        ) : (
          <div className="relative inline-block">
            <Image
              src={preview}
              alt="Preview"
              width={40}
              height={40}

              className="w-32 h-32 object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                emailRegisterForm.setValue("image", undefined);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {emailRegisterForm.formState.errors.image && (
          <p className="text-xs text-red-500 mt-1">
            {emailRegisterForm.formState.errors.image.message}
          </p>
        )}
      </div>
        {/* If any error occurs */}
                    { registerEmail.isError && (
                      <p className="text-xs text-red-500 mt-3">
                        {(registerEmail.error as AxiosError<ErrorResponse<null>>).response?.data?.message||"Something went wrong"}
                      </p>
                    )}
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        {registerEmail.isPending?"Creating...":" Create account →"}
      </Button>
    </form>
  );
};

export default EmailRegisterForm;
