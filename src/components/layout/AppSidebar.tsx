
import { PhoneCall, Home, Users, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();

  // Navigation items
  const mainItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Calls",
      icon: PhoneCall,
      path: "/calls",
    },
    {
      title: "Agents",
      icon: Users,
      path: "/agents",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 text-white">
            <PhoneCall className="h-6 w-6" />
            <span className="font-bold text-lg">CallCenter</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild active={location.pathname === item.path}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <button className="w-full flex items-center px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
