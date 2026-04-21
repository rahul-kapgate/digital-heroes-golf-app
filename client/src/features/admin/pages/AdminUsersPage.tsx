import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users", search],
    queryFn: () => adminApi.listUsers({ search }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage platform users</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><Skeleton className="h-32" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Charity</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.charities?.name || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(u.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}