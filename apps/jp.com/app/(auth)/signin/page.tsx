import { OTPLoginForm } from "@/features/auth/components/otp-login-form"

export const metadata = {
  title: "Signin",
}

const OTPLoginPage = async () => {
  return <OTPLoginForm />
}

export default OTPLoginPage
