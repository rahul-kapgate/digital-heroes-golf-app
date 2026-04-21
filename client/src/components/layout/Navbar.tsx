import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Trophy, LogOut, User as UserIcon, LayoutDashboard, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-sm group-hover:shadow-md transition-shadow">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">Digital Heroes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/charities" className="text-sm font-medium hover:text-primary transition-colors">
            Charities
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile"><UserIcon className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}