import DashboardCard from "@/components/app/dashboard/Card";

import { Badge as BadgeIcon, GraduationCap, CalendarCheck, CalendarSearch } from "lucide-react";


export default function StudentDashboard({average_mark,homeworks,lesson_in_month,lesson_visited}:Readonly<{average_mark:number,homeworks:number,lesson_in_month:number,lesson_visited:any}>){

    const _cards = [
        {
            title       :"Оцінки",
            value       :average_mark,
            decoration  :"/12",
            icon        :<BadgeIcon className=" text-violet-800" size={24}/>,
            color       :"#DBCBFE"
        },
        {
            title       :"Домашні завдання",
            value       :homeworks,
            decoration  :null,
            icon        :<GraduationCap className=" text-orange-800" size={24}/>,
            color       :"#FFD8CB"
        },
        {
            title       :"Уроків на місяць",
            value       :lesson_in_month,
            decoration  :null,
            icon        :<CalendarSearch className=" text-green-800" size={24}/>,
            color       :"#E0F6D4"
        },
        {
            title       :"Відвідування",
            value       :Math.floor((lesson_visited.visited/lesson_visited.all)*100),
            decoration  :"%",
            icon        :<CalendarCheck className=" text-yellow-800" size={24}/>,
            color       :"#FEEDCB"
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