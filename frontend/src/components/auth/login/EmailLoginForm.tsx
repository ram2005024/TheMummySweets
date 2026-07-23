import React, { useState } from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailLoginSchema, emailLoginType } from '../../../schemas/auth/LoginSchema'
import { useLoginWithEmail } from '../../../hooks/auth/useLogin'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { UnauthenticatedDialog } from './UnauthenticatedDialog'
export interface typeOfErrorDetails{
  user_id:string,
  field_name:string,
  field_value:string,
}
const EmailLoginForm = () => {
  const [unauthenticatedFlag,setUnauthenticatedFlag]=useState<boolean>(false)
  const [detailsError,setDetailsError]=useState<typeOfErrorDetails>()
  const form = useForm<emailLoginType>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(emailLoginSchema)
  })
  const mutation=useLoginWithEmail()
const handleEmailLogin=(data:emailLoginType)=>{
  mutation.mutate(data,{
    onError:(err)=>{
      const error = err as AxiosError<{ message?: string,error_code?:string,details?:typeOfErrorDetails }>;
      if(error.response){
        const errorCode=error.response?.data?.error_code
        if (errorCode==="USER_UNAUTHENTICATED"){
          setUnauthenticatedFlag(true)
          setDetailsError(error.response?.data?.details)
          return
        }
        toast.error(error.response?.data.message||"Something went wrong")
      }else{
        toast.error(error.message ||"Network error")
      }
    }
  })
}
  return (
    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(handleEmailLogin)}>
      <Input
        placeholder="you@example.com"
        {...form.register('email')}
      />
        {form.formState.errors.email && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors?.email?.message}
        </p>
      )}
      <Input
        type="password"
        placeholder="Password"
        {...form.register('password')}
      />
       {form.formState.errors.password && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors?.password?.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button variant="link" className="text-xs text-gray-500">
          Forgot password?
        </Button>
      </div>
      <Button disabled={mutation.isPending} type='submit' className="w-full bg-orange-500 hover:bg-orange-600 text-white">
        {mutation.isPending ? "Signing in....":"Sign in"}
      </Button>

      {/* If the user is unauthenticated */}
    { unauthenticatedFlag && detailsError && (
  <UnauthenticatedDialog
    open={unauthenticatedFlag}
    onClose={() => setUnauthenticatedFlag(false)}
    data={detailsError}
  />
)}
    </form>
  )
}
export default EmailLoginForm
