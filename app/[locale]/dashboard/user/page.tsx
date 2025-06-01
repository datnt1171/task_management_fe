"use client";

import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { UserProfileCard } from "@/components/user-profile-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";

export default function UserProfilePage() {
  const user = useContext(UserContext);
  const router = useRouter();

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={() => router.back()}>
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
