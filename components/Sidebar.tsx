"use client"
import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Sidebar({ fullName, email, avatar }: { fullName: string, email: string, avatar: string }) {
    const pathname = usePathname();
    return (
        <aside className='sidebar'>
            <Link href={'/'}>
                <Image
                    src={'/jsm-assets/icons/logo-full-brand.svg'}
                    alt='logo'
                    width={160}
                    height={50}
                    className='hidden h-auto lg:block'
                />
            </Link>
            <Image
                src={'/jsm-assets/icons/logo-brand.svg'}
                alt='logo'
                width={52}
                height={52}
                className='lg:hidden'
            />
            <nav className='sidebar-nav'>
                <ul className='flex flex-1 flex-col gap-6'>
                    {
                        navItems.map(item => {
                            const active = pathname === item.url;
                            return (
                                <Link
                                    className='lg:w-full'
                                    key={item.name}
                                    href={item.url}
                                >
                                    <li className={cn('sidebar-nav-item', active && 'shad-active')}>
                                        <Image
                                            className={cn('nav-icon', active && 'nav-icon-active')}
                                            src={item.icon}
                                            alt='icon'
                                            width={24}
                                            height={24}
                                        />
                                        <p className='hidden lg:block'>{item.name}</p>
                                    </li>
                                </Link>
                            );
                        })
                    }
                </ul>
            </nav>
            <Image
                src={'/jsm-assets/images/files-2.png'}
                alt='logo'
                width={506}
                height={418}
                className='w-full'
            />
            <div className='sidebar-user-info mt-3'>
                <Image
                    src={avatar}
                    alt='avatar'
                    width={44}
                    height={44}
                    className='sidebar-user-avatar'
                />
                <div className='hidden lg:block'>
                    <p className='subtitle-2 capitalize'>{fullName}</p>
                    <p className='caption'>{email}</p>
                </div>
            </div>
        </aside>
    )
}
