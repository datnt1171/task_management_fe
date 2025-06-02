"use client";

import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { UserProfileCard } from "@/components/user-profile-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react"

export default function UserProfilePage() {
  const user = useContext(UserContext);
  const router = useRouter();

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/user/change-password">Change Password</Link>
        </Button>
      </div>
      <UserProfileCard user={user} />
    </div>
  );
}
