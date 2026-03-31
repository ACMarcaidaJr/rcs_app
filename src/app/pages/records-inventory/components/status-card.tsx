'use client'
interface StatCardProps {
    label: string;
    value: any;
    loading: boolean;
    icon: React.ElementType;
}
import { Skeleton } from "@/components/ui/skeleton";

export default function StatCard({ label, value, loading, icon: Icon }: StatCardProps) {
    return (
        <div className="flex items-start justify-between border rounded-md p-2">
            <div>
                <p className="font-normal text-[12px] ">
                    {label}
                </p>
                <div className="text-2xl font-bold mt-1">
                    {loading ? <Skeleton className="h-8 w-16" /> : (value ?? 0)}
                </div>
            </div>
            <div className="bg-secondary p-2 rounded-lg text-secondary-foreground">
                <Icon size={20} />
            </div>
        </div>
    );
}