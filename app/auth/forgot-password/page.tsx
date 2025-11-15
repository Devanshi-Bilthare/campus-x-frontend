import Banner from "./components/Banner"
import ForgotPasswordForm from "./components/ForgotPasswordForm"

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
        <Banner />
        <ForgotPasswordForm />
    </div>
  )
}

export default ForgotPasswordPage

