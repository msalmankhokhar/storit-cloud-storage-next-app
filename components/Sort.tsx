"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation'
import { sortTypes } from '@/constants';


export default function Sort() {
    const router = useRouter();
    const path = usePathname();
    const handleSort = (value: string)=>{
        router.push(`${path}?sort=${value}`);
    }

    return (
        <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
            <SelectTrigger className="sort-select]">
                <SelectValue placeholder={sortTypes[0].value} />
            </SelectTrigger>
            <SelectContent className='sort-select-content'>
                {
                    sortTypes.map(sortType=>(
                        <SelectItem key={sortType.label} value={sortType.value}>{sortType.label}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}
