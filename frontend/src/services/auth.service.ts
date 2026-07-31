import axios from "axios"
import   api, { publicAPI } from "../libs/api"
import { emailLoginType, phoneLoginType } from "../schemas/auth/LoginSchema"
import { emailRegisterType, phoneRegisterType } from "../schemas/auth/RegisterSchema"
import { forget_password_change_schema, forget_schema, loginSuccessType, registerSuccessData, verifyOtp } from "../type/auth.type"
import { SuccessResponse } from "../type/common.type"
import { UserBasic } from "../type/user.type"

export class LoginService{
    static loginWithEmail=async (data:emailLoginType):Promise<SuccessResponse<loginSuccessType>>=>{
        let device_id=localStorage.getItem("device-id")
        if(!device_id){
            device_id=crypto.randomUUID()
            localStorage.setItem("device-id",device_id)
        }
        const res=await publicAPI.post("/auth/login",data,{
            headers:{
                "X-Device-ID":device_id
            }
        })
        return res.data
    }
    static loginWithPhone=async (data:phoneLoginType):Promise<SuccessResponse<loginSuccessType>>=>{
       let device_id:string|null=localStorage.getItem("device-id")
       if(!device_id){
        device_id=crypto.randomUUID()
        localStorage.setItem("device-id",device_id)
       }
        const res=await publicAPI.post("/auth/login",data,{
             headers:{
                "X-Device-ID":device_id
            }
        })
        return res.data
    }

    static verifyOtp=async(data:verifyOtp):Promise<SuccessResponse<null>>=>{
        const res=await publicAPI.post("/auth/verify/otp",data)
        return res.data
    }
}


export class RegisterService{
    static registerWithPhone=async(data:phoneRegisterType):Promise<SuccessResponse<registerSuccessData>>=>{
        const formData=new FormData()
        Object.entries(data).forEach(([key,value])=>{
            if(value !==undefined && value !==null){
                formData.append(key,value)
            }
        })
        const res=await publicAPI.post("/auth/register",formData,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        return res.data
    }
    static registerWithEmail=async(data:emailRegisterType):Promise<SuccessResponse<registerSuccessData>>=>{
          const formData=new FormData()
        Object.entries(data).forEach(([key,value])=>{
            if(value !==undefined && value !==null){
                formData.append(key,value)
            }
        })
        const res=await publicAPI.post("/auth/register",formData,{
             headers:{"Content-Type":"multipart/form-data"}
        })
        return res.data
    }
}

export class AuthService{
    static refresh=async():Promise<SuccessResponse<loginSuccessType>>=>{
        const res=await publicAPI.post("/auth/refresh")
        return res.data
    }
    static getUser=async():Promise<UserBasic>=>{
        const res=await api.get("/auth/me")
        return res.data.data
    }
    static logout=async():Promise<SuccessResponse<null>>=>{
        const res=await publicAPI.post("/auth/logout")
        return res.data
    }
    static forget=async(data:forget_schema):Promise<registerSuccessData>=>{
        const res=await publicAPI.post("/auth/forget",data)
        return res.data.data
    }
    static forget_resend=async(user_id:string):Promise<SuccessResponse<null>>=>{
        const res=await publicAPI.post(`/auth/forget/resend/${user_id}`)
        return res.data
    }
    static forget_verify=async(data:verifyOtp):Promise<registerSuccessData>=>{
        const res=await publicAPI.post("/auth/forget/verify",data)
        return res.data.data
    }
    static password_change_after_forget=async(data:forget_password_change_schema):Promise<SuccessResponse<null>>=>{
        const res=await publicAPI.post("/auth/forget/change",data)
        return res.data
    }

    static resend_otp_register=async (user_id:string):Promise<SuccessResponse<null>>=>{
        const res=await publicAPI.post("/auth/verify/resend/otp",{user_id:user_id})
        return res.data
    }
}
