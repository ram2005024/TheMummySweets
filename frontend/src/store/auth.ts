import { create } from "zustand"

interface authInterface{
    access:string|null
    setAccess:(token:string)=>void
    clear:()=>void
}
export const authStore=create<authInterface>((set)=>({
    access:null,
    setAccess:(token:string)=>set({access:token}),
    clear:()=>set({access:null})
}))
