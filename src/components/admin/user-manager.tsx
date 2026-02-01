"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateUserRoleAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UserManagerProps {
    users: any[];
}

export function UserManager({ users }: UserManagerProps) {
    const { toast } = useToast();
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const handleRoleChange = async (userId: string, newRole: "ADMIN" | "KITCHEN" | "STUDENT") => {
        setLoadingIds(prev => new Set(prev).add(userId));
        try {
            const result = await updateUserRoleAction(userId, newRole);
            if (result.success) {
                toast({ title: "Success", description: result.message });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
        } finally {
            setLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name || "Unknown"}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Select
                                        defaultValue={user.role}
                                        onValueChange={(val) => handleRoleChange(user.id, val as any)}
                                        disabled={loadingIds.has(user.id)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STUDENT">Student</SelectItem>
                                            <SelectItem value="KITCHEN">Kitchen</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {loadingIds.has(user.id) && <Loader2 className="h-4 w-4 animate-spin" />}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
