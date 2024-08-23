import DashboardCard from "@/components/app/dashboard/Card";

import { GraduationCap } from "lucide-react";


export default function TeacherDashboard({homeworks_count}:Readonly<{homeworks_count:number}>){

    const _cards = [
        {
            title       :"Домашні завдання",
            value       :homeworks_count,
            decoration  :null,
            icon        :<GraduationCap className=" text-orange-800" size={24}/>,
            color       :"#FFD8CB"
        },
    ]

    return (
        <div className="flex justify-center ">
            <div className="block-size grid grid-cols-4 gap-6">
                {_cards.map( (card:any,index:number) => (
                    <DashboardCard key={index} icon={ card.icon } icon_color={ card.color } title={ card.title } value={ card.value } decoration={ card.decoration }></DashboardCard>
                ) )}
                
            </div>
        </div>
    )
}