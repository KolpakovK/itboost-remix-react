import { ReactNode } from "react";

export default function AppHeader({subtitle,title,children}:Readonly<{title:string,subtitle?:string,children?:ReactNode}>){
    return (
        <div className="flex justify-center ">
            <div className="block-size flex items-end gap-6">
                <div className="flex flex-col gap-1 flex-1">
                    {subtitle && (<p className="text-lg text-gray-500">{subtitle}</p>)}
                    <h1 className="text-3xl text-gray-900">{title}</h1>
                </div>
                {children}
            </div>
        </div>
    )
}