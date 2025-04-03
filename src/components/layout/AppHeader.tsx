
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";

const AppHeader = () => {
  const [username, setUsername] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).name || JSON.parse(user).username : "User";
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger className="mr-2 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </SidebarTrigger>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="flex items-center gap-2">
            <div className="font-medium hidden md:block">Welcome, {username}</div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
