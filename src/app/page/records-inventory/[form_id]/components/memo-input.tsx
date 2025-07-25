"use client"
import React from 'react';
import { Input } from '@/components/ui/input';
interface MemoInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  is_disabled?: boolean;
}

export const MemoInput = React.memo(({ value, onChange, placeholder, type = 'text', is_disabled = false }: MemoInputProps) => {
  // console.log('rendering', placeholder, value);
  return <Input disabled={is_disabled} value={value} onChange={onChange} placeholder={placeholder} type={type} />;
});
