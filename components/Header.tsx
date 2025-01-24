
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'
import { logout } from '@/lib/actions/user.actions'

export default function Header({userId, accountId}:{userId: string, accountId: string}) {
  return (
    <header className='header'>
        <Search />
        <div className="header-wrapper">
            <FileUploader
                ownerId={userId}
                accountId={accountId}
            />
            <form action={async()=> {
                "use server";
                await logout();
            }}>
                <Button type='submit' className='sign-out-button'>
                    <Image
                        src={'/jsm-assets/icons/logout.svg'}
                        alt='log out icon'
                        width={24}
                        height={24}
                        className='size-6'
                    />
                </Button>
            </form>
        </div>
    </header>
  )
}
