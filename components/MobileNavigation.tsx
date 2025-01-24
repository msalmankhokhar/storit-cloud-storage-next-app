"use client"

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { navItems } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import FileUploader from './FileUploader';
import { logout } from '@/lib/actions/user.actions';

interface props {
  $id: string;
  accountId: string;
  fullName: string;
  email: string;
  avatar: string;
}


export default function MobileNavigation({ $id: ownerId, accountId, fullName, email, avatar }: props) {

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='mobile-header'>
      <Image
        src={'/jsm-assets/icons/logo-full-brand.svg'}
        alt='logo'
        width={120}
        height={52}
        className='h-auto'
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            alt='search'
            src={'/jsm-assets/icons/menu.svg'}
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className='header-user'>
              <Image
                alt='avatar'
                src={avatar}
                width={44}
                height={44}
                className='header-user-avatar'
              />
              <div className='sm:hidden lg:block'>
                <p className='subtitle-2 capitalize'>{fullName}</p>
                <p className='caption'>{email}</p>
              </div>
            </div>
            <Separator className='mb-4 bg-light-200/20' />
          </SheetTitle>
          <nav className='mobile-nav'>
            <ul className='mobile-nav-list'>
              {
                navItems.map(item => {
                  const active = pathname === item.url;
                  return (
                    <Link
                      className='lg:w-full'
                      key={item.name}
                      href={item.url}
                    >
                      <li className={cn('mobile-nav-item', active && 'shad-active')}>
                        <Image
                          className={cn('nav-icon', active && 'nav-icon-active')}
                          src={item.icon}
                          alt='icon'
                          width={24}
                          height={24}
                        />
                        <p>{item.name}</p>
                      </li>
                    </Link>
                  );
                })
              }
            </ul>
          </nav>
          <Separator className='my-5 bg-light-200/20' />
          <div className='flex flex-col justify-between gap-5 pb-5'>
            <FileUploader
              ownerId={ownerId}
              accountId={accountId}
            />
            <Button type='submit' className='sign-out-button'>
              <Image
                src={'/jsm-assets/icons/logout.svg'}
                alt='log out icon'
                width={24}
                height={24}
                onClick={async () => { await logout() }}
              />
              <p>Log out</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
