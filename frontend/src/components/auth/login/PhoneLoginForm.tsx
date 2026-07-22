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
          <Input placeholder="+977 98••••••••" {...form.register('mobile_number')}/>
              <Input type="password" placeholder="Password" {...form.register('mobile_number')} />
              <div className="flex justify-end">
                <Button variant="link" className="text-xs text-gray-500">
                  Forgot password?
                </Button>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Sign in →
              </Button>
              </form>
  )
}

export default PhoneLoginForm
