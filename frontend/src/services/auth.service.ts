import  { publicAPI } from "../libs/api"
import { emailLoginType, phoneLoginType } from "../schemas/auth/LoginSchema"
import { emailRegisterType, phoneRegisterType } from "../schemas/auth/RegisterSchema"
import { verifyOtp } from "../type/auth.type"
import { SuccessResponse } from "../type/common.type"

export class LoginService{
    static loginWithEmail=async (data:emailLoginType)=>{
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
    static loginWithPhone=async (data:phoneLoginType)=>{
        const res=await publicAPI.post("/auth/login",data)
        return res.data
    }
    static verifyOtp=async(data:verifyOtp):Promise<SuccessResponse<null>>=>{
        const res=await publicAPI.post("/auth/verify/otp",data)
        return res.data
    }
}


export class RegisterService{
    static registerWithPhone=async(data:phoneRegisterType)=>{
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
    static registerWithEmail=async(data:emailRegisterType)=>{
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
