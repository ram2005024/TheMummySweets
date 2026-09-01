import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginWithEmail } from "../../../hooks/auth/useLogin";
import {
  emailLoginSchema,
  emailLoginType,
} from "../../../schemas/auth/LoginSchema";
import { authStore } from "../../../store/auth";
import { unAuthenticatedLogin } from "../../../type/auth.type";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { UnauthenticatedDialog } from "./UnauthenticatedDialog";

const EmailLoginForm = () => {
  const [unauthenticatedFlag, setUnauthenticatedFlag] =
    useState<boolean>(false);
  const router = useRouter();
  const { setAccess } = authStore();
  const [detailsError, setDetailsError] = useState<unAuthenticatedLogin>();
  const form = useForm<emailLoginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(emailLoginSchema),
  });
  const mutation = useLoginWithEmail();
  const handleEmailLogin = (data: emailLoginType) => {
    mutation.mutate(data, {
      onError: (err) => {
        const error = err as AxiosError<{
          message?: string;
          error_code?: string;
          details?: unAuthenticatedLogin;
        }>;
        if (error.response) {
          const errorCode = error.response?.data?.error_code;
          if (errorCode === "USER_UNAUTHENTICATED") {
            setUnauthenticatedFlag(true);
            setDetailsError(error.response?.data?.details);
            return;
          }
          toast.error(error.response?.data.message || "Something went wrong");
        } else {
          toast.error(error.message || "Network error");
        }
      },
      onSuccess: (data) => {
        setAccess(data.data.access);
        toast.success(data.message || "Welcome");
        router.push("/");
      },
    });
  };
  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={form.handleSubmit(handleEmailLogin)}
    >
      <Input placeholder="you@example.com" {...form.register("email")} />
      {form.formState.errors.email && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors?.email?.message}
        </p>
      )}
      <Input
        type="password"
        placeholder="Password"
        {...form.register("password")}
      />
      {form.formState.errors.password && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors?.password?.message}
        </p>
      )}

      <Button
        disabled={mutation.isPending}
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        {mutation.isPending ? "Signing in...." : "Sign in"}
      </Button>

      {/* If the user is unauthenticated */}
      {unauthenticatedFlag && detailsError && (
        <UnauthenticatedDialog
          open={unauthenticatedFlag}
          onClose={() => setUnauthenticatedFlag(false)}
          data={detailsError}
        />
      )}
    </form>
  );
};
export default EmailLoginForm;
