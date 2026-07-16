import { SignIn } from "@clerk/nextjs";
import React from "react";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignIn forceRedirectUrl={"/"} />
    </div>
  );
};

export default Login;
