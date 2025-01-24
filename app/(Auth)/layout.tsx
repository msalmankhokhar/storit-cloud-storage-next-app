import Image from "next/image";

export default function AuthLayout({children} : {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex">
        <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex">
            <div className="flex flex-col justify-center gap-8 max-h-[800px] max-w-[430px]">
                <div className="text-white flex items-center gap-3">
                    <Image
                        src={'/img/logos/logo-white.png'}
                        alt="icon"
                        width={50}
                        height={50}
                        className="h-auto"
                    />
                    <span className="font-medium text-lg">Storeit</span>
                </div>
                <div className="space-y-2 text-white">
                    <h1 className="h1">Manage your files the best way</h1>
                    <p className="body-1">This is a place where you can store all your documents</p>
                </div>
                <Image 
                    className="self-center transition-all hover:rotate-2 hover:scale-105"
                    alt="illustration"
                    src={'/img/graphics/auth-Illustration.png'}
                    width={230}
                    height={230}
                />
            </div>
        </section>

        <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
            <div className="mb-8 lg:hidden">
                <Image
                    src={'/jsm-assets/icons/logo-full-brand.svg'}
                    alt="logo"
                    width={224}
                    height={81}
                    className="h-auto w-[120px] lg:w-[150px]"
                />
            </div>
            {children}
        </section>
    </div>
  )
}
