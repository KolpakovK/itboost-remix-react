import DashboardCard from "@/components/app/dashboard/Card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Badge as BadgeIcon, GraduationCap, CalendarCheck, CalendarSearch, AlertOctagon, Video } from "lucide-react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { ua } from "~/routes/translation";
import { Button } from "@/components/ui/button";


export default function StudentDashboard({average_mark,homeworks,lesson_in_month,lesson_visited,future_lessons}:Readonly<{average_mark:number,homeworks:number,lesson_in_month:number,lesson_visited:any,future_lessons:any[]}>){

    const _cards = [
        {
            title       :ua.dashboard.student.cards[0],
            value       :average_mark,
            decoration  :"/12",
            icon        :<BadgeIcon className=" text-violet-800" size={24}/>,
            color       :"#DBCBFE",
            action      :<Button variant={"secondary"} size={"sm"} asChild><a href="/activity">{ua.dashboard.student.cardsBtn[0]}</a></Button>
        },
        {
            title       :ua.dashboard.student.cards[1],
            value       :homeworks,
            decoration  :null,
            icon        :<GraduationCap className=" text-orange-800" size={24}/>,
            color       :"#FFD8CB",
            action      :<Button variant={"secondary"} size={"sm"} asChild><a href="/homework">{ua.dashboard.student.cardsBtn[1]}</a></Button>
        },
        {
            title       :ua.dashboard.student.cards[2],
            value       :lesson_in_month,
            decoration  :null,
            icon        :<CalendarSearch className=" text-green-800" size={24}/>,
            color       :"#E0F6D4",
            action      :<Button variant={"secondary"} size={"sm"} asChild><a href="/calendar">{ua.dashboard.student.cardsBtn[2]}</a></Button>
        },
        {
            title       :ua.dashboard.student.cards[3],
            value       :lesson_visited.all ? (Math.floor((lesson_visited.visited/lesson_visited.all)*100)) : ("-"),
            decoration  :lesson_visited.all ? "%" : "",
            icon        :<CalendarCheck className=" text-yellow-800" size={24}/>,
            color       :"#FEEDCB",
            action      :<Button variant={"secondary"} size={"sm"} asChild><a href="/activity">{ua.dashboard.student.cardsBtn[3]}</a></Button>
        },
    ]

    return (
        <div className="flex flex-col gap-8 items-center px-4 lg:px-0">
            <div className="block-size grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-6">
                {_cards.map( (card:any,index:number) => (
                    <DashboardCard key={index} icon={ card.icon } icon_color={ card.color } title={ card.title } value={ card.value } decoration={ card.decoration } children={ card.action }></DashboardCard>
                ) )}
                
            </div>

            <div className="block-size p-3 lg:p-4 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col gap-4 min-h-[450px]">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{ua.dashboard.student.scheduleLabel}</p>

                    <div className="flex gap-2 items-center">
                        <div className="size-4 rounded bg-green-100 border border-green-300"></div>
                        <p className=" text-sm text-gray-700">{ua.dashboard.tableHint[0]}</p>
                    </div>
                </div>

                {!future_lessons.length && (
                    <Alert>
                        <AlertOctagon className="size-4 !text-yellow-600" />
                        <AlertTitle>{ua.dashboard.student.alert.title}</AlertTitle>
                        <AlertDescription>{ua.dashboard.student.alert.description}</AlertDescription>
                    </Alert>                          
                )}

                {future_lessons && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{ua.dashboard.student.tableCol[0]}</TableHead>
                                <TableHead>{ua.dashboard.student.tableCol[1]}</TableHead>
                                <TableHead>{ua.dashboard.student.tableCol[2]}</TableHead>
                                <TableHead>{ua.dashboard.student.tableCol[3]}</TableHead>
                                <TableHead className="text-right">{ua.dashboard.student.tableCol[4]}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {future_lessons.map( (lesson:any,index:number) => (

                            <TableRow key={index} className={format(lesson.lesson_date,"dd.MM.yyyy") == format(new Date,"dd.MM.yyyy") ? "bg-green-50" : "bg-white"}>
                                <TableCell className="font-medium">{lesson.course.title}</TableCell>
                                <TableCell>{`${lesson.teacher.first_name} ${lesson.teacher.last_name}`}</TableCell>
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