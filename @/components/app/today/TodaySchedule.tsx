import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

import { UserCheck2, UserMinus2, Clock, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadHomeWork from "./UploadHW";



export default function TodaySchedule(){
    let submit = useSubmit();
    let static_data:any = useLoaderData();
    let dynamic_data:any = useActionData();

    const [isLoading,SetIsLoading] = useState(true);
    const [selectedLesson,setSelectedLesson] = useState(0);
    const [hasTheme,setHasTheme] = useState(false);

    useEffect( () => {
        SetIsLoading(false);
    }, [static_data])

    useEffect( () => {
        if (!hasTheme && dynamic_data){
            if (!dynamic_data.error){
                setHasTheme(true);
            }
        }
    } ,[dynamic_data])

    useEffect( () => {
        if (static_data){
            if (static_data.data[selectedLesson].students){

                if (static_data.data[selectedLesson].students[0].attendance) setHasTheme(true)
                else setHasTheme(false)

            }
            else setHasTheme(false)
        }
    },[selectedLesson] )


    function CheckStudent(value:any,student_id:string,lesson_id:string){
        submit({
            type:"checkStudent",
            student_id:student_id,
            lesson_id:lesson_id,
            is_late: value=="late",
            is_present: value!="missing"
        },{method:"POST"})
    }

    function MarkStudent(value:any,student_id:string,lesson_id:string){
        submit({
            type:"markStudent",
            student_id:student_id,
            lesson_id:lesson_id,
            value: +value
        },{method:"POST"})
    }

    return (
        <div className="flex justify-center px-4 lg:px-0">
            <div className="block-size flex flex-col gap-6">
                {(!isLoading) && (
                    <Tabs className="w-full overflow-scroll lg:overflow-hidden" defaultValue="0" onValueChange={ (v:string) => setSelectedLesson(parseInt(v)) }>
                        <TabsList>
                            {static_data.data.map( (item:any,index:number) => (
                                <TabsTrigger key={index} value={`${index}`}>{`${item.course.title} - ${item.group.title}`}</TabsTrigger>
                            ))}
                        </TabsList>

                        {static_data.data.map( (item:any,index:number) => (
                            <TabsContent key={index} value={`${index}`}>
                                <div className="flex flex-col gap-0 p-4 bg-white rounded-md border border-gray-200 shadow-sm w-full min-w-[550px]">
                                    <div className="flex justify-between items-end pb-6">
                                        {hasTheme ? (
                                            <div className="flex gap-4 items-end">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-gray-500">Тема урока</p>
                                                    <p className="text-lg lg:text-3xl text-gray-900 font-medium">{item.title}</p>
                                                </div>
                                                <Button variant={"outline"} size={"icon"} onClick={ () => setHasTheme(false) }><Edit size={20}/></Button>
                                            </div>
                                        ) : (
                                            <Form action="/today" method="post" className="flex gap-4 items-end">
                                                <Input className=" hidden" name="lesson_id" value={item.id} readOnly/>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-gray-500">Тема урока</p>
                                                    <Input type="text" name="lesson_theme" className=" min-w-[250px]"/>
                                                </div>
                                                <Button type="submit" name="type" value="setTheme">Зберегти</Button>
                                            </Form>
                                        )}

                                        <div className={hasTheme ? ("") : ("opacity-50 pointer-events-none")}>
                                            <UploadHomeWork lesson={item.id} lessonTitle={item.title}/>
                                        </div>
                                    </div>
                                    
                                    {item.students.map( (student:any,studentIndex:number) => (
                                        <div key={studentIndex} className="flex items-center gap-2 py-3 border-b border-gray-200" style={ {opacity: hasTheme ? "1" : "0.5", pointerEvents: hasTheme ? "all" : "none"} }>
                                            <Avatar>
                                                <AvatarImage src={student.avatar ? (static_data.serverURI.slice(0, -1)+student.avatar) : ("")}/>
                                                <AvatarFallback>{`${student.first_name[0]}${student.last_name[0]}`}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm lg:text-md text-gray-900 flex-1">
                                                {student.first_name} {student.last_name}
                                            </p>

                                            <ToggleGroup onValueChange={ (value:any) => CheckStudent(value,student.id,item.id) } defaultValue={ student.attendance ? (
                                                student.attendance.is_late ? "late" : (student.attendance.is_present ? "present" : "missing")
                                            ) : "missing" } type="single" size={"sm"}>
                                                <ToggleGroupItem value="missing"><UserMinus2 className=" text-red-700" size={16}/></ToggleGroupItem>
                                                <ToggleGroupItem value="late"><Clock className=" text-yellow-700" size={16}/></ToggleGroupItem>
                                                <ToggleGroupItem value="present"><UserCheck2 className=" text-green-700" size={16}/></ToggleGroupItem>
                                            </ToggleGroup>

                                            <div className={ student.attendance ? (!student.attendance.is_present ? "pointer-events-none opacity-50" : "") : "" }>
                                            <Select onValueChange={ (value:any) => MarkStudent(value,student.id,item.id) } defaultValue={ student.attendance ? (student.attendance.grade_on_lesson ? student.attendance.grade_on_lesson.toString() : "" ) : "" }>
                                                <SelectTrigger className="w-[100px]">
                                                    <SelectValue placeholder="Оцінка"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1</SelectItem>
                                                    <SelectItem value="2">2</SelectItem>
                                                    <SelectItem value="3">3</SelectItem>
                                                    <SelectItem value="4">4</SelectItem>
                                                    <SelectItem value="5">5</SelectItem>
                                                    <SelectItem value="6">6</SelectItem>
                                                    <SelectItem value="7">7</SelectItem>
                                                    <SelectItem value="8">8</SelectItem>
                                                    <SelectItem value="9">9</SelectItem>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="11">11</SelectItem>
                                                    <SelectItem value="12">12</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            </div>
                                        </div>
                                    ) )}

                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </div>
    )
}