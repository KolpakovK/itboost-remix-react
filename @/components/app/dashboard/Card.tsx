import { ReactNode } from "react";

export default function DashboardCard({title,value,decoration,icon,icon_color=""}:Readonly<{title:string,value:string,decoration?:string,icon_color?:string,icon?:ReactNode}>){
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            {icon && ( <div className="size-16 rounded-md flex items-center justify-center bg-gray-50" style={ { backgroundColor : icon_color } }>{icon}</div> )}

            <div className="flex flex-col gap-0">
                <p className="text-sm text-gray-500">{title}</p>
                <p className=" text-3xl text-gray-900 font-medium">{value}{decoration && (<span className="text-sm text-gray-500 font-normal">{decoration}</span>)}</p>
            </div>
        </div>
    )
}