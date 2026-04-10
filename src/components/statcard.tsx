'use client'

interface StatCardProps {
    label: string;
    value: any;
    loading: boolean;
    icon: React.ElementType;
    className?: string;
}
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils'

export default function StatCard({ label, value, loading, icon: Icon, className }: StatCardProps) {
    return (
        <div className="flex items-center justify-start border rounded-md p-3 gap-4 ">
            <div className={cn("bg-secondary p-5 rounded-lg text-secondary-foreground", className)}>
                <Icon size={24} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="font-normal text-[12px] text-foreground">
                    {label}
                </p>
                <div className="text-2xl font-bold ">
                    {loading ? <Skeleton className="h-8 w-16" /> : (value ?? 0)}
                </div>
            </div>

        </div>
    );
}