import React from 'react';
import {
    IconCircleFilled,
    IconArrowRight,
    IconCheck,
    IconArrowLeft
} from '@tabler/icons-react';

export type TaskStatus = 'draft' | 'submitted' | 'received' | 'returned';

interface StatusBadgeProps {
    status: TaskStatus | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config: Record<string, { className: string; icon: React.ReactNode }> = {
        draft: {
            className: "h-fit dark:bg-gray-800 dark:text-gray-100 bg-gray-100 text-gray-900",
            icon: <IconCircleFilled size={10} />,
        },
        submitted: {
            className: "h-fit dark:bg-blue-800 dark:text-blue-100 bg-blue-100 text-blue-900",
            icon: <IconArrowRight size={13} />,
        },
        received: {
            className: "h-fit dark:bg-green-800 dark:text-green-100 bg-green-100 text-green-900",
            icon: <IconCheck size={13} />,
        },
        returned: {
            className: "h-fit dark:bg-red-800 dark:text-red-100 bg-red-100 text-red-900",
            icon: <IconArrowLeft size={13} />,
        },
    };

    const activeConfig = config[status.toLowerCase()] || config.draft;

    return (
        <div className={`${activeConfig.className} font-medium w-fit px-3 py-1 rounded-full flex flex-row gap-1 items-center capitalize`}>
            {activeConfig.icon}
            <p className="text-xs">{status}</p>
        </div>
    );
};

export default StatusBadge;