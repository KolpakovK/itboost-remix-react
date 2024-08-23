"use client"

import {  useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { viewWeek, createViewMonthAgenda, createViewMonthGrid, createViewWeek, } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { format, addMinutes } from 'date-fns'
import { useActionData } from '@remix-run/react'

import './index.css'

import { useEffect,useState } from 'react'
import { useSubmit } from '@remix-run/react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from '@/components/ui/badge'

import { Calendar, UserCircle, Clock, Users } from 'lucide-react'
  

const eventsServicePlugin = createEventsServicePlugin();

function CalendarScreen() {
    const submit = useSubmit();
    let schedule:any = useActionData();

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
            end: '21:00',
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
                    setIsLoading(true);
                    const formData = new FormData();
                    formData.append("start_data", format(date,"yyyy-MM-dd") );
                    submit(formData, { method: "post" });
                }
            },

            onEventClick(calendarEvent) {
                setSelectedEvent(calendarEvent.server_data);
                setOpenDialog(true)
            },
        }
    })

    useEffect( () => {
            const formData = new FormData();
            formData.append("start_data", selectedDate );
            submit(formData, { method: "post" });
    },[])

    useEffect( () => {
        if (schedule){
            setIsLoading(false);
        }
    }, [schedule] )

    useEffect( () => {
        if (schedule){
            schedule.data.month.forEach( (item:any) => {
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
    }, [isLoading] )
    
    return (
        <div className="flex justify-center ">
            <div className="block-size">
                {!isLoading && (

                    <div>
                        <Sheet open={openDialog} onOpenChange={ () => setOpenDialog(false) }>
                            
                            <SheetContent>
                                
                                {selectedEvent.course && (
                                    <div className='flex flex-col gap-8'>
                                        <SheetHeader>
                                            <SheetTitle>{selectedEvent.course.title}</SheetTitle>
                                        
                                            <SheetDescription>
                                                {selectedEvent.course.desc}
                                            </SheetDescription>
                                        </SheetHeader>

                                        <div className='flex flex-col gap-2'>
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