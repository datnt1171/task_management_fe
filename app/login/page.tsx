import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your tasks and workflows</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
