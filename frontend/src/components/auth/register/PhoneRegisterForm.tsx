"use client";

import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  phoneRegisterSchema,
  phoneRegisterType,
} from "../../../schemas/auth/RegisterSchema";
import Image from "next/image";
import { useRegisterPhone } from "../../../hooks/auth/useRegister";
import { UnauthenticatedDialog } from "../login/UnauthenticatedDialog";
import { ErrorResponse } from "../../../type/common.type";
import { AxiosError } from "axios";

const PhoneRegisterForm = () => {
  const registerPhone=useRegisterPhone()
  const [user_id,setUserID]=useState<string>("")
  const [open,setOpen]=useState<boolean>(false)
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
    const [preview, setPreview] = useState<string | null>(null);


  const handlePhoneRegisterForm = (data: phoneRegisterType) => {
    registerPhone.mutate(data,{
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
      onSubmit={phoneRegisterForm.handleSubmit(handlePhoneRegisterForm)}
    >
      {/* If the register is succeed then  */}
      {open && user_id && <UnauthenticatedDialog data={{field_value:phoneRegisterForm.getValues("mobile_number"),field_name:"phone no.",user_id:user_id}} onSuccessURL="/login" onClose={()=>setOpen(false)} open={open}/>}
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
      {/* Image Upload with Preview + Delete */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Image (optional)
              </label>

              {!preview ? (
                <Controller control={phoneRegisterForm.control} name="image" render={({ field }) => ( <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; field.onChange(file); if (file) { setPreview(URL.createObjectURL(file)); } else { setPreview(null); } }} /> )} />
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
                      phoneRegisterForm.setValue("image", undefined);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              )}

              {phoneRegisterForm.formState.errors.image && (
                <p className="text-xs text-red-500 mt-1">
                  {phoneRegisterForm.formState.errors.image.message}
                </p>
              )}
            </div>

            {/* If any error occurs */}
            { registerPhone.isError && (
              <p className="text-xs text-red-500 mt-3">
                {(registerPhone.error as AxiosError<ErrorResponse<null>>).response?.data?.message||"Something went wrong"}
              </p>
            )}

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        {registerPhone.isPending?"Creating...":" Create account →"}
      </Button>
    </form>
  );
};

export default PhoneRegisterForm;
