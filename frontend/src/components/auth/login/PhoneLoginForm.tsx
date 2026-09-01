import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginWithPhone } from "../../../hooks/auth/useLogin";
import {
  phoneLoginSchema,
  phoneLoginType,
} from "../../../schemas/auth/LoginSchema";
import { authStore } from "../../../store/auth";
import { unAuthenticatedLogin } from "../../../type/auth.type";
import { ErrorResponse } from "../../../type/common.type";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { UnauthenticatedDialog } from "./UnauthenticatedDialog";

const PhoneLoginForm = () => {
  const loginPhone = useLoginWithPhone();
  const [open, setOpen] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<unAuthenticatedLogin>();
  const { setAccess } = authStore();
  const router = useRouter();
  const form = useForm<phoneLoginType>({
    defaultValues: {
      mobile_number: "",
      password: "",
    },
    resolver: zodResolver(phoneLoginSchema),
  });
  const handleRegisterLogin = (data: phoneLoginType) => {
    loginPhone.mutate(data, {
      onSuccess: (data) => {
        setAccess(data.data.access);
        toast.success(data.message);
        router.push("/");
      },
      onError: (err) => {
        const error = err as AxiosError<ErrorResponse<unAuthenticatedLogin>>;
        if (error.response) {
          // If the user is unauthenticated
          const error_code = error.response?.data?.error_code;
          if (error_code == "USER_UNAUTHENTICATED") {
            setOpen(true);
            setDetailsError(error.response?.data?.details);
            return;
          }
        }
      },
    });
  };
  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={form.handleSubmit(handleRegisterLogin)}
    >
      {/* For unauthenticated login */}
      {open && detailsError && (
        <UnauthenticatedDialog
          open={open}
          onClose={() => setOpen(false)}
          data={detailsError}
        />
      )}
      <div className="flex items-center gap-2">
        {/* Fixed prefix outside */}
        <span className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 select-none">
          +977
        </span>

        {/* Input only for 10 digits */}
        <Input
          type="tel"
          maxLength={10}
          placeholder="98••••••••"
          {...form.register("mobile_number")}
          className="flex-1"
        />
      </div>
      {form.formState.errors.mobile_number && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors.mobile_number.message}
        </p>
      )}
      <Input
        type="password"
        placeholder="Password"
        {...form.register("password")}
      />
      {form.formState.errors?.password && (
        <p className="text-xs text-red-500 mt-1">
          {form.formState.errors.password.message}
        </p>
      )}
      {loginPhone.isError && (
        <p className="mt-2 text-red-500 text-xs">
          {(loginPhone.error as AxiosError<ErrorResponse<unAuthenticatedLogin>>)
            .response?.data?.message || "Something went wrong"}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        {loginPhone.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default PhoneLoginForm;
