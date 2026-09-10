import { OTPLoginForm } from "@/features/auth/components/otp-login-form"

export const metadata = {
  title: "Sign in",
}

const OTPLoginPage = async () => {
  return <OTPLoginForm />
}

export default OTPLoginPage
