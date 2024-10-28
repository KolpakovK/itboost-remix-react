"use client"

import {  useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { viewWeek, createViewMonthAgenda, createViewMonthGrid, createViewWeek, } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { format, addMinutes, startOfWeek, endOfWeek, getMonth } from 'date-fns'
import { useActionData, useFetcher } from '@remix-run/react'

import './index.css'

import { useEffect,useState } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from '@/components/ui/badge'

import { Calendar, UserCircle, Clock, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

const eventsServicePlugin = createEventsServicePlugin();

function CalendarScreen({serverURI=""}:Readonly<{serverURI?:string}>) {
    let schedule:any = useFetcher();

    const [isLoading,setIsLoading] = useState(true)
    const [selectedDate,setSelectedDate] = useState(format(new Date(),"yyyy-MM-dd"));

    const [openDialog,setOpenDialog] = useState(false)
    const [selectedEvent,setSelectedEvent]:any = useState({});

    const calendar = useCalendarApp({
        locale: 'uk-UA',
        defaultView: viewWeek.name,
        views: [createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        dayBoundaries: {
            start: '09:00',
            end: '23:59',
        },

        weekOptions:{
            gridHeight: 650,
        },
        events: [],
        plugins:[eventsServicePlugin],
        callbacks: {
            onSelectedDateUpdate(date) {
                if (format(date,"yyyy-MM")!=format(selectedDate,"yyyy-MM")){
                    setSelectedDate(format(date,"yyyy-MM-dd"));
                    // Get the start and end of the week for the selected date
                    const startOfTheWeek = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
                    const endOfTheWeek = endOfWeek(date, { weekStartsOn: 1 }); // Sunday end

                    const formData = new FormData();
                    formData.append("start_data", format(startOfTheWeek,"yyyy-MM-dd") );
                    formData.append("end_data", format(endOfTheWeek,"yyyy-MM-dd") );
                    schedule.submit(formData, { method: "post" });
                }
            },

            onEventClick(calendarEvent) {
                setSelectedEvent(calendarEvent.server_data);
                setOpenDialog(true)
            },
        }
    })

    useEffect( () => {
            // Get the start and end of the week for the selected date
            const startOfTheWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
            const endOfTheWeek = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday end

            const formData = new FormData();
            formData.append("start_data", format(startOfTheWeek,"yyyy-MM-dd") );
            formData.append("end_data", format(endOfTheWeek,"yyyy-MM-dd") );
            schedule.submit(formData, { method: "post" });
    },[])

    useEffect( () => {
        if (schedule.data){
            setIsLoading(false);

            schedule.data.data.month.forEach( (item:any) => {
                try{
                    if (!eventsServicePlugin.get(item.id)){
                        let start_date = format(item.lesson_date,"yyyy-MM-dd HH:mm");
                        let end_date = addMinutes(item.lesson_date,item.duration);
                        let end_format_date = format(end_date,"yyyy-MM-dd HH:mm");
                        eventsServicePlugin.add({
                            title: item.course.title,
                            start: start_date,
                            end: end_format_date,
                            id: item.id,
                            server_data:item,
                            _options:{
                                additionalClasses: ["card-padding"]
                            }
                        })
                    }
                }catch{
                    console.log("Action issue")
                }
            });
        }
    }, [schedule] )

    
    return (
        <div className="flex justify-center px-4 lg:px-0">
            <div className="block-size">
                {!isLoading && (

                    <div>
                        <Sheet open={openDialog} onOpenChange={ () => setOpenDialog(false) }>
                            
                            <SheetContent className='h-full'>
                                
                                {selectedEvent.course && (
                                    <div className='flex flex-col gap-8'>
                                        <SheetHeader>
                                            <SheetTitle>{selectedEvent.course.title}</SheetTitle>
                                        
                                            <SheetDescription>
                                                {selectedEvent.course.desc}
                                            </SheetDescription>
                                        </SheetHeader>

                                        <div className='flex flex-col gap-2 h-full'>
                                            <Alert>
                                                <Calendar className="h-4 w-4" />
                                                <AlertTitle>Довжина курсу</AlertTitle>
                                                <AlertDescription>
                                                    {`Цей курс складається з ${selectedEvent.course.Lesson_count} занять.`}
                                                </AlertDescription>
                                            </Alert>

                                            <Alert>
                                                <UserCircle className="h-4 w-4" />
                                                <AlertTitle>Викладач</AlertTitle>
                                                <AlertDescription>
                                                    {selectedEvent.teacher.avatar && (
                                                        <img src={serverURI.slice(0, -1)+selectedEvent.teacher.avatar} className=" size-8 rounded-full object-cover"/>
                                                    )}
                                                    {`${selectedEvent.teacher.first_name} ${selectedEvent.teacher.last_name}`}
                                                </AlertDescription>
                                            </Alert>

                                            <Alert>
                                                <Users className="h-4 w-4" />
                                                <AlertTitle>Група</AlertTitle>
                                                <AlertDescription>
                                                    {`${selectedEvent.group.title}`}
                                                </AlertDescription>
                                            </Alert>

                                            <Alert>
                                                <Clock className="h-4 w-4" />
                                                <AlertTitle>Початок заняття</AlertTitle>
                                                <AlertDescription>
                                                    <Badge>{`${ format(selectedEvent.lesson_date,"HH:mm") }`}</Badge>
                                                    <Badge variant={"outline"}>{`${ format(selectedEvent.lesson_date,"MM.dd.yyyy") }`}</Badge>
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                        
                                        <Button asChild>
                                            <a href={selectedEvent.lesson_url} target='_blank'>Приєднатись до дзвінку</a>
                                        </Button>
                                        
                                    </div>
                                )}
                                
                            </SheetContent>
                            
                            
                        </Sheet>

                        <ScheduleXCalendar calendarApp={calendar} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CalendarScreen