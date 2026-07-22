import React from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailLoginSchema, emailLoginType } from '../../../schemas/auth/LoginSchema'

const EmailLoginForm = () => {
  const form = useForm<emailLoginType>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(emailLoginSchema)
  })
const handleEmailLogin=(data:emailLoginType)=>{
  console.log(data)
}
  return (
    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(handleEmailLogin)}>
      <Input
        placeholder="you@example.com"
        {...form.register('email')}
      />
      <Input
        type="password"
        placeholder="Password"
        {...form.register('password')}
      />
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

export default EmailLoginForm
