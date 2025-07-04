'use client';

import { Models } from 'node-appwrite'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
import { Input } from './ui/input';
import { Button } from './ui/button';
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from './ActionsModalContent';


function ActionDropdown({ file }: { file: Models.Document }) {

    const path = usePathname();

    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);

    const operations = ["rename", "share", "delete", "details"];
    const [fileName, setFileName] = useState<string>(file.name);


    const closeAllModels = () => {
        setIsModelOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setFileName(file.name);

    }

    const handleAction = async () => {
        if (!action) return;

        setIsLoading(true);
        let success = false;

        const actions = {
            rename: () => renameFile({ fileId: file.$id, name: fileName, extension: file.extension, path }),
            share: () => updateFileUsers({ fileId: file.$id, emails, path }),
            delete: () => deleteFile({ fileId : file.$id , bucketFileId : file.bucketFileId , path})

        }

        success = await actions[action.value as keyof typeof actions]();
        if (success) closeAllModels();

        setIsLoading(false);
    }

    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email);

        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updatedEmails,
            path
        });

        if (success) setEmails(updatedEmails);
        closeAllModels();
    }

    const renderDialogContent = () => {
        if (!action) return null;
        const { value, label } = action;
        return (

            <DialogContent className='shad-dialog button' >
                <DialogHeader className='flex flex-col gap-3 '>
                    <DialogTitle className='text-center text-light-100'>{label}</DialogTitle>
                    {value === "rename" && (<Input value={fileName} onChange={(e => setFileName(e.target.value))} />)}
                    {value === "details" && (<FileDetails file={file} />)}
                    {value === "share" && (<ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser} />)}
                    {value === "delete" && (
                        <p className='delete-confirmation'>
                            Are you sure you want to delete{` `}
                            <span className='delete-file-name'>{file.name}</span>
                        </p>
                    )}
                </DialogHeader>

                {['rename', "delete", "share"].includes(value) && (
                    <DialogFooter className='flex flex-col gap-3 md:flex-row'>
                        <Button className='modal-cancel-button' onClick={closeAllModels}>Cancel</Button>
                        <Button onClick={handleAction} className='modal-submit-button'>
                            <p className='capitalize'>{value}</p>
                            {isLoading &&
                                (<Image src="/assets/icons/loader.svg" alt='loader' width={24} height={24} className='animate-spin' />)
                            }
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        )
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>

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

            {renderDialogContent()}
        </Dialog>
    )
}

export default ActionDropdown
