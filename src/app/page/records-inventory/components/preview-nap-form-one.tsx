"use client"
import { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';


export default function PreviewNapFormOneDialog() {


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Preview
                </Button>
            </DialogTrigger>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        <p>previewing the Nap form one ID: </p>
                        <DialogDescription >
                            <p>eme eme lang muna ito</p>
                        </DialogDescription>
                    </DialogTitle>
                </DialogHeader>
                {/* BODY */}
                <div>
                
                </div>
            </DialogContent>
        </Dialog>
    )
} 