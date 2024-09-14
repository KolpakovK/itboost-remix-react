import { ReactNode } from "react";

export default function AppHeader({subtitle,title,children}:Readonly<{title:string,subtitle?:string,children?:ReactNode}>){
    return (
        <div className="flex justify-center px-4 lg:px-0">
            <div className="block-size flex items-end gap-2 lg:gap-6">
                <div className="flex flex-col gap-1 flex-1">
                    {subtitle && (<p className="text-sm lg:text-lg text-gray-500 leading-none">{subtitle}</p>)}
                    <h1 className="text-xl lg:text-3xl text-gray-900 leading-none">{title}</h1>
                </div>
                {children}
            </div>
        </div>
    )
}