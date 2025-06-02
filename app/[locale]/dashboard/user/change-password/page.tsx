"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react"

export default function ChangePasswordPage() {
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [re_new_password, setReNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await changePassword({ current_password, new_password, re_new_password });
      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setReNewPassword("");
      setTimeout(() => {
        router.push("/dashboard/user");
      }, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        "Failed to change password. Please check your input."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="current_password">Current Password</Label>
          <Input
            id="current_password"
            type="password"
            value={current_password}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="new_password">New Password</Label>
          <Input
            id="new_password"
            type="password"
            value={new_password}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="re_new_password">Confirm New Password</Label>
          <Input
            id="re_new_password"
            type="password"
            value={re_new_password}
            onChange={e => setReNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
