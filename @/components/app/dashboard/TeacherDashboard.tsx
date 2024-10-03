import DashboardCard from "@/components/app/dashboard/Card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { GraduationCap, AlertOctagon, Video } from "lucide-react";
import { Label } from "@/components/ui/label";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { ua } from "~/routes/translation";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard({homeworks_count,future_lessons}:Readonly<{homeworks_count:number,future_lessons:any[]}>){

    const _cards = [
        {
            title       :ua.dashboard.teacher.cards[0],
            value       :homeworks_count,
            decoration  :null,
            icon        :<GraduationCap className=" text-orange-800" size={24}/>,
            color       :"#FFD8CB",
            action      :<Button variant={"secondary"} size={"sm"} asChild><a href="/homework">{ua.dashboard.teacher.cardsBtn[0]}</a></Button>
        },
    ]

    return (
        <div className="flex flex-col gap-8 items-center px-4 lg:px-0">
            <div className="block-size grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                {_cards.map( (card:any,index:number) => (
                    <DashboardCard key={index} icon={ card.icon } icon_color={ card.color } title={ card.title } value={ card.value } decoration={ card.decoration } children={ card.action }></DashboardCard>
                ) )}
                
            </div>

            <div className="block-size p-3 lg:p-4 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col gap-4 min-h-[450px]">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{ua.dashboard.teacher.scheduleLabel}</p>

                    <div className="flex gap-2 items-center">
                        <div className="size-4 rounded bg-green-100 border border-green-300"></div>
                        <p className=" text-sm text-gray-700">{ua.dashboard.tableHint[0]}</p>
                    </div>
                </div>

                {!future_lessons.length && (
                    <Alert>
                        <AlertOctagon className="size-4 !text-yellow-600" />
                        <AlertTitle>{ua.dashboard.teacher.alert.title}</AlertTitle>
                        <AlertDescription>{ua.dashboard.teacher.alert.description}</AlertDescription>
                    </Alert>                          
                )}

                {future_lessons && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{ua.dashboard.teacher.tableCol[0]}</TableHead>
                                <TableHead>{ua.dashboard.teacher.tableCol[1]}</TableHead>
                                <TableHead>{ua.dashboard.teacher.tableCol[2]}</TableHead>
                                <TableHead>{ua.dashboard.teacher.tableCol[3]}</TableHead>
                                <TableHead className="text-right">{ua.dashboard.teacher.tableCol[4]}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {future_lessons.map( (lesson:any,index:number) => (

                            <TableRow key={index} className={format(lesson.lesson_date,"dd.MM.yyyy") == format(new Date,"dd.MM.yyyy") ? "bg-green-50" : "bg-white"}>
                                <TableCell className="font-medium">{lesson.course.title}</TableCell>
                                <TableCell>{lesson.group.title}</TableCell>
                                <TableCell><Badge variant={"secondary"}>{ format(lesson.lesson_date,"dd.MM.yyyy") == format(new Date,"dd.MM.yyyy") ? "Сьогодні" : format(lesson.lesson_date,"dd.MM.yyyy") }</Badge></TableCell>
                                <TableCell><Badge>{ format(lesson.lesson_date,"HH:mm") }</Badge></TableCell>
                            
                                <TableCell className="text-right">
                                    <Button variant={"outline"} size={"icon"} asChild>
                                        <a href={lesson.lesson_url} target="_blank">
                                            <Video size={16}/>
                                        </a>
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ) )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}