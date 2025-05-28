import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiUser, FiMail, FiBriefcase, FiUsers } from "react-icons/fi";

interface UserProfileCardProps {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    department?: { id: number; name: string };
    role?: { id: number; name: string };
    supervisor?: { id: number; username: string; first_name: string; last_name: string };
  };
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiUser className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>
              {user.first_name} {user.last_name}
            </CardTitle>
            <div className="text-gray-500 text-sm">@{user.username}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3">
            <FiMail className="w-5 h-5 text-gray-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiBriefcase className="w-5 h-5 text-gray-500" />
            <span>
              Department:{" "}
              <Badge variant="secondary">{user.department?.name || "N/A"}</Badge>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FiUsers className="w-5 h-5 text-gray-500" />
            <span>
              Role: <Badge variant="secondary">{user.role?.name || "N/A"}</Badge>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FiUser className="w-5 h-5 text-gray-500" />
            <span>
              Supervisor:{" "}
              {user.supervisor
                ? `${user.supervisor.first_name} ${user.supervisor.last_name}`
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
