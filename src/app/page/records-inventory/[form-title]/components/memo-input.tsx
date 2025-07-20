import React from 'react';
import { Input } from '@/components/ui/input';
interface MemoInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export const MemoInput = React.memo(({ value, onChange, placeholder, type = 'text' }: MemoInputProps) => {
    console.log('rendering', placeholder, value);
  return <Input value={value} onChange={onChange} placeholder={placeholder} type={type} />;
});
