import React from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

const EmailLoginForm = () => {
  return (
   <form className="mt-4 space-y-4">
     <Input placeholder="you@example.com" />
              <Input type="password" placeholder="Password" />
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
