'use client';

import { Models } from 'node-appwrite'
import { Dialog } from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import Image from 'next/image';
import { actionsDropdownItems } from '@/constants';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';


function ActionDropdown({ file }: { file: Models.Document }) {

    const [isModel, setIsModelOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);

    const operations = ["rename", "share", "delete", "details"];

    return (
        <Dialog open={isDropdownOpen} onOpenChange={setIsModelOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger>
                    <Image
                        src='/assets/icons/dots.svg'
                        alt=''
                        width={34}
                        height={34}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className='max-w-[200px] truncate'>
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (

                        <DropdownMenuItem key={actionItem.value}
                            className='shad-dropdown-item'
                            onClick={() => {
                                setAction(actionItem);
                                if (operations.includes(actionItem.value)) setIsModelOpen(true);
                            }}
                        >
                            {actionItem.value === "download" ? 

                            <Link href={constructDownloadUrl(file.bucketFileId)}
                                download={file.name}
                                className='flex item-center gap-2'
                            >
                                <Image
                                    src={actionItem.icon}
                                    alt={actionItem.label}
                                    width={30}
                                    height={30}
                                />
                                {actionItem.label}
                            </Link>

                                :

                                <div className='flex item-center gap-2'>
                                    <Image
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </div>


                            }
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    )
}

export default ActionDropdown
