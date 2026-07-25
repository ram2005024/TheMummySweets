"use client"
import React, { useEffect, useState } from 'react'
import SplashScreen from '../components/SplashLoading'
import { authStore } from '../store/auth'
import { AuthService } from '../services/auth.service'
import queryClient from '../libs/queryClient'

const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [loading,setLoading]=useState<boolean>(true)
    useEffect(()=>{
        (async ()=>{
            try {
                const res=await AuthService.refresh()
                authStore.getState().setAccess(res.data.access)
                const user=await AuthService.getUser()
                queryClient.setQueryData(["me"],user)
            } catch (error) {
                authStore.getState().setAccess("")
                console.log(error)
            }finally{
                setLoading(false)
            }
        })()
    },[])
    if(loading){
        return <SplashScreen/>
    }
  return (
    <>
    {children}
    </>
  )
}

export default AuthProvider
