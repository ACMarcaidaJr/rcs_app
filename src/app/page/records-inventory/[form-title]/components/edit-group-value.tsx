"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconRelationOneToMany } from "@tabler/icons-react";

export default function EditGroupValue() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-md w-fit flex flex-row gap-2" variant="ghost">
          Group values
          <IconRelationOneToMany size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Group Values</DialogTitle>
          <DialogDescription>Add a default value for its subunit</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'Title and description', placeholder: 'Enter' },
            { label: 'Period Covered / Inclusive Dates', placeholder: 'Year', type: 'year' },
            { label: 'Volume in cubic meter', placeholder: 'Number', type: 'number' },
            { label: 'Records medium', placeholder: 'Enter' },
            { label: 'Restrictions', placeholder: 'Enter' },
            { label: 'Location of records', placeholder: 'Enter' },
            { label: 'Frequency of use', placeholder: 'Frequency of use' },
            { label: 'Duplication', placeholder: 'Duplication' },
          ].map((field, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Label>{field.label}</Label>
              <Input placeholder={field.placeholder} type={field.type || 'text'} />
            </div>
          ))}
          
          <div className="flex flex-col gap-2">
            <Label>Time value (T/P)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose one..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T">Temporary</SelectItem>
                <SelectItem value="P">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Utility value</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose one..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Adm">Administrative</SelectItem>
                <SelectItem value="F">Fiscal</SelectItem>
                <SelectItem value="L">Legal</SelectItem>
                <SelectItem value="Arc">Archival</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
            <Label>Retention period (Active, Storage, Total)</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="number" placeholder="Active (years)" />
              <Input type="number" placeholder="Storage (years)" />
              <Input type="number" placeholder="Total (years)" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Disposition schedule</Label>
            <Input type="number" placeholder="Years" />
          </div>
        </div>
        

        <DialogFooter className="pt-4">
          <Button type="submit">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
