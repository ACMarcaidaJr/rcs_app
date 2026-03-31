"use client"

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';

interface MemoSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}

export const MemoSelect = React.memo(({ value, onChange, placeholder = 'Choose one...', children }: MemoSelectProps) => {
  console.log('rendering Select:', placeholder, value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
});
