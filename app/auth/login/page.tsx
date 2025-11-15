import Banner from "./components/Banner"
import LoginForm from "./components/LoginForm"

const LoginPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
        <Banner />
        <LoginForm />
    </div>
  )
}

export default LoginPage