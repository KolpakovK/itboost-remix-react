import { ReactNode } from "react";

export default function DashboardCard({title,value,decoration,icon,icon_color="",children=null}:Readonly<{title:string,value:string,decoration?:string,icon_color?:string,icon?:ReactNode,children?:ReactNode}>){
    return (
        <div className="flex flex-col gap-4 p-3 lg:p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 ">
                {icon && ( <div className="size-12 lg:size-16 rounded-md flex items-center justify-center bg-gray-50" style={ { backgroundColor : icon_color } }>{icon}</div> )}

                <div className="flex flex-col gap-0">
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-xl lg:text-3xl text-gray-900 font-medium">{value}{decoration && (<span className="text-sm text-gray-500 font-normal">{decoration}</span>)}</p>
                </div>
            </div>

            {children!=null && (
                <>
                    {children}
                </>
            )}
        </div>
    )
}