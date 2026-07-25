// Verify otp interface
export interface verifyOtp{
    user_id:string,
    otp:string
}
// LoginSuccess
export interface loginSuccessType{
    access:string
}
// Unauthenticated response for login
export interface unAuthenticatedLogin{
field_name?:string,
field_value?:string,
user_id:string,
}

// Register success
export interface registerSuccessData{
    user_id:string
}
