
import { useState } from "react";
import { Bell, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AppHeader = () => {
  const [notifications] = useState([
    { id: 1, text: "New call received", time: "5m ago" },
    { id: 2, text: "Agent John went offline", time: "10m ago" },
    { id: 3, text: "System update completed", time: "1h ago" },
  ]);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 shadow-sm">
      <div className="flex items-center w-full">
        <SidebarTrigger />
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-brand-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="py-3">
                  <div className="flex flex-col">
                    <span>{notification.text}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-brand-100 text-brand-700">AD</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-sm font-medium hidden md:inline-block">Admin User</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

import { Settings, LogOut } from "lucide-react";

export default AppHeader;
