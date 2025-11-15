import { Suspense } from "react";
import Banner from "./components/Banner"
import ResetPasswordForm from "./components/ResetPasswordForm"

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
        <Banner />
        <Suspense fallback={<div className="w-full md:w-[50%] p-4 md:p-8 text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
    </div>
  )
}

export default ResetPasswordPage

