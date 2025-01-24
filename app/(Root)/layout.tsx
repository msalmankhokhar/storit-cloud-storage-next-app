import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const currentuser = await getCurrentUser();
    if(!currentuser) return redirect('/login')
    return (
        <main className='flex h-screen'>
            <Sidebar fullName={currentuser.fullName} email={currentuser.email} avatar={currentuser.avatar} />
            <section className='flex h-full flex-1 flex-col'>
                <MobileNavigation {... currentuser} />
                <Header userId={currentuser.$id} accountId={currentuser.accountId} />
                <div className="main-content">{children}</div>
            </section>
        </main>
    )
}
