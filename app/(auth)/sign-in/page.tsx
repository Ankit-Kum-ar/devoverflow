"use client";
import { AuthForm } from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{
        email: "guest@gmail.com",
        password: "Guest@123",
      }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;
