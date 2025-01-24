"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
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
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Models } from 'node-appwrite'
import { actionsDropdownItems } from '@/constants'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'
import { FileDetails } from './ActionsModalContent'
import ShareInput from './ActionsModalContent'

export default function ActionsDropDown({ file }: { file: Models.Document }) {

    const [isModalOpen, setModalOpen] = useState(false);
    const [isDropDownOpen, setDropDownOpen] = useState(false);
    const [fileAction, setFileAction] = useState<ActionType | null>(null);
    const [fileName, setFileName] = useState(file.name);
    const [loading, setLoading] = useState(false);
    const [shareEmails, setShareEmails] = useState<string[]>([]);
    const path = usePathname();

    const closeAllModals = ()=>{
        setModalOpen(false);
        setDropDownOpen(false);
        setFileAction(null);
        setFileName(file.name);
        // setEmails
    }

    const handleAction = async ()=>{
        if (!fileAction) return;
        setLoading(true);
        let success = false;
        const actions = {
            rename: ()=>(
                renameFile({fileId: file.$id, name: fileName, extension: file.extension, path})
            ),
            share: ()=>(
                updateFileUsers({fileId: file.$id, emails: shareEmails, path})
            ),
            delete: ()=>(
                deleteFile({fileId: file.$id, bucketFileId: file.bucketFileId, path})
            ),
        }
        success = await actions[fileAction.value as keyof typeof actions]();
        console.log(success);
        if (success) {
            closeAllModals();
        }
        setLoading(false);
    }

    const handleRemoveUserFromShare = async(email: string)=> {
        const updatedShareEmails = shareEmails.filter((shareEmail)=> shareEmail != email);
        const success = await updateFileUsers({fileId: file.$id, emails: updatedShareEmails, path});
        if(success) setShareEmails(updatedShareEmails);
        closeAllModals();
    }

    const renderDialogContent = () => {
        if (!fileAction) return null;
        const {value, label} = fileAction;
        return (
            <DialogContent className='shad-dialog-button'>
                <DialogHeader className='flex flex-col gap-3'>
                    <DialogTitle className='text-center text-light-100'>
                        {label}
                    </DialogTitle>
                    {
                        value === 'rename' && (
                            <Input
                                type='text'
                                value={fileName}
                                onChange={(event)=> setFileName(event.target.value)}
                            />
                        )
                    }
                    {
                        value === 'details' && (
                            <FileDetails file={file} />
                        )
                    }
                    {
                        value === 'share' && (
                            <ShareInput file={file} onInputChange={setShareEmails} onRemove={handleRemoveUserFromShare} />
                        )
                    }
                    {
                        value === 'delete' && (
                            <p className='delete-confirmation'>
                                Are you sure to delete <span className='delete-file-name'>{file.name}</span>?
                            </p>
                        )
                    }
                </DialogHeader>
                {
                    ['rename', 'delete', 'share'].includes(value) && (
                        <DialogFooter className='flex flex-col gap-3 md:flex-row'>
                            <Button onClick={closeAllModals} className="modal-cancel-button">Cancel</Button>
                            <Button onClick={handleAction} className='modal-submit-button'>
                                <p className='capitalize'>{value}</p>
                                {
                                    loading && (
                                        <Image
                                          alt='loader'
                                          src={'/jsm-assets/icons/loader.svg'}
                                          width={24}
                                          height={24}
                                          className='animate-spin'
                                        />
                                    )
                                }
                            </Button>
                        </DialogFooter>
                    )
                }
            </DialogContent>
        )
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
            <DropdownMenu open={isDropDownOpen} onOpenChange={setDropDownOpen}>
                <DropdownMenuTrigger className='shad-no-focus'>
                    <Image
                        alt='dots'
                        src={'/jsm-assets/icons/dots.svg'}
                        width={24}
                        height={24}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className='max-w-[200px] truncate'>
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        actionsDropdownItems.map(item => (
                            <DropdownMenuItem className='shad-dropdown-item' key={item.value} onClick={() => {
                                setFileAction(item);
                                if (['rename', 'share', 'delete', 'details'].includes(item.value)) {
                                    setModalOpen(true);
                                }
                            }}>
                                {
                                    item.value === 'download' ? (
                                        <Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className='flex items-center gap-2'>
                                            <Image
                                                alt={item.label}
                                                src={item.icon}
                                                height={30}
                                                width={30}
                                            />{item.label}
                                        </Link>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <Image
                                                alt={item.label}
                                                src={item.icon}
                                                height={30}
                                                width={30}
                                            />{item.label}
                                        </div>
                                    )
                                }
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>

    )
}
