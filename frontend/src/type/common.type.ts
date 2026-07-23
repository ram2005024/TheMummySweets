// Success Response
export interface SuccessResponse<T>{
    success:boolean,
    message:string,
    data:T
}

// Error response
export interface ErrorResponse<T>{
    success:boolean,
    message:string,
    details:T
}
