import LoginForm from "@/components/login-form"
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("LoginPage");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">{t("subtitle")}</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
