import DashboardCard from "@/components/app/dashboard/Card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { GraduationCap, AlertOctagon } from "lucide-react";
import { Label } from "@/components/ui/label";


export default function TeacherDashboard({homeworks_count,future_lessons}:Readonly<{homeworks_count:number,future_lessons:any[]}>){

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
        <div className="flex flex-col gap-8 items-center px-4 lg:px-0">
            <div className="block-size grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                {_cards.map( (card:any,index:number) => (
                    <DashboardCard key={index} icon={ card.icon } icon_color={ card.color } title={ card.title } value={ card.value } decoration={ card.decoration }></DashboardCard>
                ) )}
                
            </div>

            <div className="block-size p-3 lg:p-4 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col gap-4 min-h-[450px]">
                <p className="text-sm text-gray-500">Графік занять на наступні 2 тижні</p>

                {future_lessons && (
                    <div className="flex flex-col gap-2">
                        {!future_lessons.length && (
                            <Alert>
                                <AlertOctagon className="size-4 !text-yellow-600" />
                                <AlertTitle>У вас в графіку нема занять!</AlertTitle>
                                <AlertDescription>
                                    Якщо ви впевнені, що у вас є назначені заняття - зверніться до адміністрації.
                                </AlertDescription>
                            </Alert>                          
                        )}


                        {future_lessons.map( (lesson:any,index:number) => (
                            <div key={index} className={cn(
                                "flex flex-col lg:flex-row gap-2 lg:items-center p-2 lg:p-3 border border-gray-200 rounded-md",
                                format(lesson.lesson_date,"dd.MM.yyyy") == format(new Date,"dd.MM.yyyy") ? "bg-green-50" : "bg-white" )}>
                                <div className="flex flex-col flex-1">
                                    <p className="text-lg lg:text-xl text-gray-900 font-medium">{lesson.course.title}</p>
                                    <p className="text-sm text-gray-500">{lesson.course.desc}</p>
                                </div>

                                <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
                                    <Label>Група:</Label>
                                    <Badge variant={"outline"}>{ lesson.group.title }</Badge>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    <Badge>{ format(lesson.lesson_date,"HH:mm") }</Badge>
                                    <Badge variant={"secondary"}>{ format(lesson.lesson_date,"dd.MM.yyyy") == format(new Date,"dd.MM.yyyy") ? "Сьогодні" : format(lesson.lesson_date,"dd.MM.yyyy") }</Badge>
                                </div>
                            </div>
                        ) )}
                    </div>
                )}
            </div>
        </div>
    )
}