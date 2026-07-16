"use client";
import queryClient from "@/app/libs/queryClient";
import tokenSetter from "@/app/libs/token";
import { syncUser } from "@/app/services/auth.service";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
const AuthSynchronizer = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  tokenSetter(getToken);
  useEffect(() => {
    (async () => {
      if (isSignedIn) {
        try {
          setLoading(true);
          const res = await syncUser();
          queryClient.setQueryData(["me"], res.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [isSignedIn]);
  if (loading) {
    return null;
  }
  return <div>{children}</div>;
};

export default AuthSynchronizer;
