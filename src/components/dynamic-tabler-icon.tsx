"use client"
import * as TablerIcons from '@tabler/icons-react';

type Props = {
    iconName: string;
    size?: number;
};

export function DynamicTablerIcon({ iconName, size = 24 }: Props) {
    const IconComponent = (TablerIcons as any)[iconName];

    if (!IconComponent) return null;

    return <IconComponent size={size} />;
}
