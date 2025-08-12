"use client"

import { Button } from "@/components/custom/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import * as React from 'react';
import myWorkspacePNG from '@/../public/assets/my-workspace.png'

import { IconPencil } from "@tabler/icons-react"
import AddOfficeDialog from "./add-office-dialog";
import { Skeleton } from "@/components/ui/skeleton";
export default function Offices() {
    const [isLoadingOffices, setIsLoadingOffices] = React.useState<boolean>(false)
    const [officesData, setOfficesData] = React.useState<[]>()

    const fetchForms = async () => {
        try {

            setIsLoadingOffices(true)
            const res = await fetch('/api/account-office')
            const data = await res.json()
            setOfficesData(data?.data)

        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingOffices(false)
        }
    }

    React.useEffect(() => {
        fetchForms()
    }, [])
    console.log("officesData", officesData)
    return (
        <div>
            <div className="flex flex-col gap-3">
                {
                    !isLoadingOffices ?
                        (
                            officesData?.length ? officesData.map((office: any, idx: number) => (
                                <Card key={idx}>
                                    <CardHeader>
                                        <CardTitle>{office.name_of_office}</CardTitle>
                                        <CardDescription>{office.address}</CardDescription>
                                        <CardAction>
                                            <Button variant='outline'>
                                                <IconPencil />
                                            </Button>
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-row flex-nowrap gap-1">
                                                <p className="font-medium ">Department/Division:</p>
                                                <p className="text-wrap">{office.department_or_division}</p>
                                            </div>
                                            <div className="flex flex-row flex-nowrap gap-1">
                                                <p className="font-medium ">Section/Unit:</p>
                                                <p className="text-wrap">{office.section_or_unit}</p>
                                            </div>
                                            <div className="flex flex-row flex-nowrap gap-1">
                                                <p className="font-medium ">Trunkline:</p>
                                                <p className="text-wrap">{office.telephone_no}</p>
                                            </div>
                                            <div className="flex flex-row flex-nowrap gap-1">
                                                <p className="font-medium ">Local No.:</p>
                                                <p className="text-wrap">{office.local_no}</p>
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            )) :
                            <div className="m-auto flex flex-col gap-3 justify-content items-center w-full max-w-md mb-8 lg:mb-0">
                                <Image
                                    src='/assets/my-workspace.svg'
                                    alt="My Workspace"
                                    width={300}
                                    height={240}
                                    className=" h-auto object-contain"
                                    priority
                                />
                                <AddOfficeDialog />
                            </div>
                )
                :
                <Skeleton className='h-[40px]  rounded-lg' />
                }


            </div>
        </div>
    )
}