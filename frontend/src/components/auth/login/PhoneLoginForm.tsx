import React from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { useForm } from 'react-hook-form'
import { phoneLoginSchema, phoneLoginType } from '../../../schemas/auth/LoginSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const PhoneLoginForm = () => {
  const form=useForm<phoneLoginType>({
  defaultValues:{
    mobile_number:"",
    password:""
  },
  resolver:zodResolver(phoneLoginSchema)
})
const handleRegisterLogin=(data:phoneLoginType)=>{
  console.log(data)
}
  return (
    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(handleRegisterLogin)}>
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
              {...form.register("mobile_number")}
              className="flex-1"
            />

          </div>
            {form.formState.errors.mobile_number && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors.mobile_number.message}
        </p>
      )}
              <Input type="password" placeholder="Password" {...form.register('password')} />
               {form.formState.errors?.password && (
              <p className="text-xs text-red-500 mt-1">
                   {form.formState.errors.password.message}
              </p>
            )}
              <div className="flex justify-end">
                <Button variant="link" className="text-xs text-gray-500">
                  Forgot password?
                </Button>
              </div>
              <Button type='submit' className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Sign in →
              </Button>
              </form>
  )
}

export default PhoneLoginForm
