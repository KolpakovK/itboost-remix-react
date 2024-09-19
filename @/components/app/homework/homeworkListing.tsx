import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Form, useActionData } from "@remix-run/react";
import { format, isFuture, compareDesc } from "date-fns";

import { useSubmit } from "@remix-run/react";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Download, MessageCircleMore, HeartHandshake } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"  
  
import { ua } from "~/routes/translation";

export function HomeworkStudentListing({selectedView=""}:Readonly<{selectedView?:string}>){
    const submit = useSubmit();
    let action_data:any = useActionData()

    const [isFullWidth,setIsFullWidth] = useState(false);
    const [homeworksToDo,setHomeworksToDo]:any = useState([]);
    const [allHomeworks,setAllHomeworks]:any = useState({
        courses:[],
        homeworks:[],
    });
    const [server,setServer]:any = useState("");

    useEffect( () => {
        setIsFullWidth(selectedView=="all")
    }, [selectedView] )

    useEffect( () => {
        if (action_data){
            if (action_data.type){
                if (action_data.type=="to-do"){
                    setHomeworksToDo([...action_data.data]);
                    setServer(action_data.serverURI);
                }
                if (action_data.type=="uploaded"){
                    submit({type:"getHomework"},{method:"POST"})
                }
                if (action_data.type=="all"){
                    setAllHomeworks(action_data.data);
                }
            }
        }
    }, [action_data] )

    function getHomeworksByCourse(id:string){
        submit({type:"getAllHomework",course_id:id},{method:"POST"})
    }

    return (
        <div className="flex justify-center px-4 lg:px-0">
            <div className="block-size flex justify-center">
                <div className={cn(
                    "p-4 bg-white rounded-md border border-gray-200 shadow-sm min-h-[450px] duration-150",
                    isFullWidth ? "w-full" : "w-full lg:w-1/2"
                )}>
                    {!isFullWidth ? (
                    <div className="flex flex-col gap-3">
                        {!homeworksToDo.length && (
                            <Alert>
                                <HeartHandshake className="size-4 !text-green-600" />
                                <AlertTitle>{ua.homeworkPage.student.alert.title}</AlertTitle>
                                <AlertDescription>{ua.homeworkPage.student.alert.description}</AlertDescription>
                            </Alert>                          
                        )}

                        {homeworksToDo.map( (homework:any,index:number) => (
                            <HomeworkStudentCard serverURI={server} card={homework}  key={index}/>
                        ) )}
                    </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {allHomeworks.courses.length!=0 && (
                                <div className="flex items-center gap-2">
                                    <Label>{ua.homeworkPage.student.filters.course}</Label>
                                    <Select defaultValue={allHomeworks.courses[0].id} onValueChange={ (v:string) => getHomeworksByCourse(v) }>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Оберіть" />
                                        </SelectTrigger>
                                        <SelectContent>

                                            {allHomeworks.courses.map( (course:any,index:number) => (
                                                <SelectItem key={index} value={course.id}>{course.title}</SelectItem>
                                            ) )}
                                            
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {allHomeworks.courses.length!=0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">{ua.homeworkPage.student.table[0]}</TableHead>
                                            <TableHead>{ua.homeworkPage.student.table[1]}</TableHead>
                                            <TableHead>{ua.homeworkPage.student.table[2]}</TableHead>
                                            <TableHead>{ua.homeworkPage.student.table[3]}</TableHead>
                                            <TableHead>{ua.homeworkPage.student.table[4]}</TableHead>
                                            <TableHead className="w-[200px] text-right">{ua.homeworkPage.student.table[5]}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allHomeworks.homeworks.map( (homework:any,index:number) => (
                                            <HomeworkStudentTableCard serverURI={server} card={homework} key={index} index={index}/>
                                        ) )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


function HomeworkStudentCard({card, serverURI}:Readonly<{card:any, serverURI:any}>){
    return(
        <div className="flex flex-col gap-4 p-3 rounded-md bg-transparent hover:bg-slate-50 duration-150">

            <div className="flex justify-between">
                <div className="flex flex-col gap-0">
                    <p className="text-lg text-slate-900">{card.lesson.title}</p>
                    <p className="text-sm text-slate-500">{card.lesson.course.title}</p>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex gap-1 items-center">
                        <p className="text-sm font-medium text-slate-900">{ua.homeworkPage.student.card.teacher}</p>
                        <p className="text-sm font-medium text-slate-500">{`${card.lesson.teacher.first_name} ${card.lesson.teacher.last_name}`}</p>
                    </div>
                    <div className="flex gap-1 items-center">
                        <p className="text-sm font-medium text-slate-900">{ua.homeworkPage.student.card.dueDate}</p>
                        <p className={cn("text-sm font-medium", isFuture(card.due_date) ? "text-slate-500" : "text-red-500") }>{ format(card.due_date,"dd.MM.yyyy")}</p>
                    </div>
                </div>
            </div>

            {card.description && (
                <p className="text-sm w-2/3 text-slate-500">{card.description}</p>
            )}

            <div className="flex justify-between gap-2">
                <div className="flex-1">
                {card.homework_file && (
                    <Button className="w-fit" variant={"outline"} size={"sm"} asChild>
                        <a href={`${serverURI.slice(0, -1)}${card.homework_file}`} target="_blank" download><Download className="mr-2" size={20}/> {ua.homeworkPage.student.card.hwBtn}</a>
                    </Button>
                )}
                </div>

                <UploadHomeworkFromStudent homework={card.id}/>
            </div>
        </div>
    )
}

function HomeworkStudentTableCard({card, serverURI,index=0}:Readonly<{card:any, serverURI:any,index?:number}>){
    return(
        <TableRow>
            <TableCell className="font-medium">{index+1}</TableCell>

            <TableCell className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={card.lesson.course.poster ? (serverURI.slice(0, -1)+card.lesson.course.poster) : ("")} />
                    <AvatarFallback>{card.lesson.course.title[0]}</AvatarFallback>
                </Avatar>
                <p>{card.lesson.title}</p>
            </TableCell>

            <TableCell>
                {card.homework_file && (
                    <Button className="w-fit mr-2" variant={"secondary"} size={"sm"} asChild>
                        <a href={`${serverURI.slice(0, -1)}${card.homework_file}`} target="_blank" download><Download className="mr-2" size={20}/> {ua.homeworkPage.student.tableRow.hwBtn}</a>
                    </Button>
                )}
                {card.description && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size={"icon"} variant={"outline"}><MessageCircleMore size={20}/></Button>
                        </PopoverTrigger>
                        <PopoverContent>{card.description}</PopoverContent>
                    </Popover>
                )}
            </TableCell>

            <TableCell>{`${card.lesson.teacher.first_name} ${card.lesson.teacher.last_name}`}</TableCell>

            <TableCell>{ format(card.date_create,"dd.MM.yyyy") }</TableCell>

            <TableCell className="text-right">
                {card.submission ? (
                    <Badge variant={ card.submission.grade ? "default" : "secondary" }>{card.submission.grade ? card.submission.grade : ua.homeworkPage.student.tableRow.notMarked}</Badge>
                ) : (
                    ua.homeworkPage.student.tableRow.toDo
                )}
            </TableCell>

        </TableRow>
    )
}


function UploadHomeworkFromStudent({homework}:Readonly<{homework:any}>){
    const { toast } = useToast();

    let action_data:any = useActionData();

    const [isOpened,setIsOpened] = useState(false);
    const [fileIsAllowed,setFileIsAllowed]:any = useState(true);

    useEffect( () => {
        if (action_data){
            if (action_data.type){
                if (action_data.type=="uploaded"){
                    toast({
                        title:"Готово"
                    })
                    setIsOpened(false);
                }
            }
        }
    }, [action_data] )
    
    function onFileSelectedHandler(e:any){
        const files = e.target.files[0];
        if(files.size > 5000000) {
            setFileIsAllowed(false)
        }
        else{
            setFileIsAllowed(true)
        }
    }

    return(
        <Dialog open={isOpened} onOpenChange={ (open:boolean) => setIsOpened(open) }>
            <DialogTrigger asChild><Button variant={"secondary"}>Завантажити роботу</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Завантажити роботу</DialogTitle>
                    <DialogDescription>
                        Введіть одайте опис та завантажте файл на перевірку.
                    </DialogDescription>
                </DialogHeader>

                <Form method="POST" className="flex flex-col gap-8" encType="multipart/form-data">
                    <input type="text" readOnly name="homework" value={homework} className=" hidden"/>
                    <input type="text" readOnly name="type" value={"uploadHomework"} className=" hidden"/>
                    <div className="flex flex-col gap-6">

                        <div className="flex flex-col gap-2">
                            <Label>Коментар</Label>
                            <Textarea name="comment"/>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label>Файл</Label>
                            <Input onChange={ (e:any) => onFileSelectedHandler(e) } type="file" name="file" required/>
                            <p className=" text-sm text-gray-500">Файл не повинен бути більше ніж 5 мегабайт</p>
                        </div>
                    </div>

                    <div className={cn( !fileIsAllowed && " pointer-events-none opacity-50" )}>
                        <Button>Завантажити</Button>
                    </div>
                </Form>

            </DialogContent>
        </Dialog>
    )
}



// SUKA TEACHER
export function HomeworkTeacherListing({selectedView=""}:Readonly<{selectedView?:string}>){
    const submit = useSubmit();
    let action_data:any = useActionData()

    const [isFullWidth,setIsFullWidth] = useState(false);
    const [homeworksToDo,setHomeworksToDo]:any = useState([]);
    const [selectedGroupId,setSelectedGroupId] = useState("");
    const [selectedGroupIndex,setSelectedGroupIndex] = useState(0);
    const [allHomeworks,setAllHomeworks]:any = useState({
        groups:[],
        submissions:[],
    });
    const [server,setServer]:any = useState("");

    useEffect( () => {
        setIsFullWidth(selectedView=="all")
    }, [selectedView] )

    useEffect( () => {
        if (action_data){
            if (action_data.type){
                if (action_data.type=="to-do"){
                    setHomeworksToDo([...action_data.data]);
                    setServer(action_data.serverURI);
                }
                if (action_data.type=="uploaded"){
                    submit({type:"getHomework"},{method:"POST"})
                }
                if (action_data.type=="all"){
                    if (action_data.data.groups.length!=0){
                        if (selectedGroupId=="") setSelectedGroupId(action_data.data.groups[0].id)
                    }
                    setSelectedGroupIndex(0)
                    setAllHomeworks(action_data.data);
                }
            }
        }
    }, [action_data] )

    function getHomeworksByGroup(id:string){
        if (action_data.data.groups){
            let index = 0;
            action_data.data.groups.forEach((group:any,group_index:number) => {
                if (group.id == id) index = group_index;
            });
            setSelectedGroupIndex(index);
        }

        setSelectedGroupId(id);
        submit({type:"getAllHomework",group_id:id},{method:"POST"})
    }

    function getHomeworksByCourse(id:string){
        submit({type:"getAllHomework",group_id:selectedGroupId,course_id:id},{method:"POST"})
    }

    return (
        <div className="flex justify-center px-4 lg:px-0">
            <div className="block-size flex justify-center">
                <div className={cn(
                    "p-4 bg-white rounded-md border border-gray-200 shadow-sm min-h-[250px] duration-150",
                    isFullWidth ? "w-full" : "w-full lg:w-1/2"
                )}>
                    {/* Homeworks to check */}
                    {!isFullWidth ? (
                    <div className="flex flex-col gap-3">
                        {!homeworksToDo.length && (
                            <Alert>
                                <HeartHandshake className="size-4 !text-green-600" />
                                <AlertTitle>{ua.homeworkPage.teacher.alert.title}</AlertTitle>
                                <AlertDescription>{ua.homeworkPage.teacher.alert.description}</AlertDescription>
                            </Alert>                          
                        )}

                        {homeworksToDo.map( (homework:any,index:number) => (
                            <HomeworkTeacherCard serverURI={server} card={homework}  key={index}/>
                        ) )}
                    </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {/* all homeworks */}
                            {allHomeworks.groups.length!=0 && (
                                <div className="flex items-center gap-4 w-full overflow-scroll lg:overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <Label>{ua.homeworkPage.teacher.filters.group}</Label>
                                        <Select defaultValue={allHomeworks.groups[0].id} onValueChange={ (v:string) => getHomeworksByGroup(v) }>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Оберіть" />
                                            </SelectTrigger>
                                            <SelectContent>

                                                {allHomeworks.groups.map( (group:any,index:number) => (
                                                    <SelectItem key={index} value={group.id}>{group.title}</SelectItem>
                                                ) )}
                                                
                                            </SelectContent>
                                        </Select>
                                    </div>


                                    <div className="flex items-center gap-2">
                                        <Label>{ua.homeworkPage.teacher.filters.course}</Label>
                                        <Select defaultValue={allHomeworks.groups[selectedGroupIndex].courses[0].id} onValueChange={ (v:string) => getHomeworksByCourse(v) }>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Оберіть" />
                                            </SelectTrigger>
                                            <SelectContent>

                                                {allHomeworks.groups[selectedGroupIndex].courses.map( (course:any,index:number) => (
                                                    <SelectItem key={index} value={course.id}>{course.title}</SelectItem>
                                                ) )}
                                                
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {allHomeworks.groups.length!=0 && (
                            <Table className=" overflow-scroll">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">{ua.homeworkPage.teacher.table[0]}</TableHead>
                                        <TableHead>{ua.homeworkPage.teacher.table[1]}</TableHead>
                                        <TableHead>{ua.homeworkPage.teacher.table[2]}</TableHead>
                                        <TableHead className="w-[100px]">{ua.homeworkPage.teacher.table[3]}</TableHead>
                                        <TableHead>{ua.homeworkPage.teacher.table[4]}</TableHead>
                                        <TableHead>{ua.homeworkPage.teacher.table[5]}</TableHead>
                                        <TableHead className="w-[200px] text-right">{ua.homeworkPage.teacher.table[6]}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allHomeworks.submissions.map( (homework:any,index:number) => (
                                        <HomeworkTableTeacherCard serverURI={server} card={homework} key={index} index={index}/>
                                    ) )}
                                </TableBody>
                            </Table>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


function HomeworkTeacherCard({card, serverURI}:Readonly<{card:any, serverURI:any}>){
    const submit = useSubmit();

    function setMark(v:string){
        let form = new FormData();

        form.append("id",card.id);
        form.append("grade",v);
        form.append("type","setMark");

        submit(form,{method:"POST"});
    }


    return(
        <div className="flex flex-col gap-4 p-3 rounded-md bg-transparent hover:bg-slate-50 duration-150">

            <div className="flex flex-col lg:flex-row lg:justify-between gap-2 w-full">
                <div className="flex flex-col gap-2">
                    
                    <div className="flex flex-col gap-2">
                        <Avatar>
                            <AvatarImage src={card.student.avatar ? (serverURI.slice(0, -1)+card.student.avatar) : ("")} />
                            <AvatarFallback>{`${card.student.first_name[0]}${card.student.last_name[0]}`}</AvatarFallback>
                        </Avatar>
                        <p className="text-lg text-slate-900">{`${card.student.first_name} ${card.student.last_name}`}</p>
                    </div>
                    

                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                            <p className="text-sm font-medium text-slate-900">{ua.homeworkPage.teacher.card.course}</p>
                            <p className="text-sm font-medium text-slate-500">{card.homework.title}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                            <p className="text-sm font-medium text-slate-900">{ua.homeworkPage.teacher.card.uploaded}</p>
                            <p className={cn("text-sm font-medium text-slate-500")}>{ format(card.date_submitted,"dd.MM.yyyy")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:items-end gap-2 lg:w-1/3 lg:pl-3 lg:border-l lg:border-l-slate-200">
                    <p className="text-sm font-medium text-slate-900">{ua.homeworkPage.teacher.card.task}</p>
                    {card.homework.homework_file && (
                        <Button className="w-fit" variant={"secondary"} size={"sm"} asChild>
                            <a href={`${serverURI.slice(0, -1)}${card.homework.homework_file}`} target="_blank" download><Download className="mr-2" size={20}/> {ua.homeworkPage.teacher.card.hwBtn}</a>
                        </Button>
                    )}

                    {card.homework.description && (
                        <p className="text-sm font-medium text-slate-500 lg:text-right">{card.homework.description}</p>
                    )}
                </div>
            </div>

            {card.comment && (
                <p className="text-sm w-2/3 text-slate-500">{card.comment}</p>
            )}

            <div className="flex justify-between gap-2">
                <div className="flex-1">
                {card.file && (
                    <Button className="w-fit" variant={"outline"} size={"sm"} asChild>
                        <a href={`${serverURI.slice(0, -1)}${card.file}`} target="_blank" download><Download className="mr-2" size={20}/> {ua.homeworkPage.teacher.card.workBtn}</a>
                    </Button>
                )}
                {!card.file && (
                    <Badge variant={"outline"}>{ua.homeworkPage.teacher.card.missingFile}</Badge>
                )}
                </div>

                <Select onValueChange={(v:string) => setMark(v)}>
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
    )
}


function HomeworkTableTeacherCard({card, serverURI,index=0}:Readonly<{card:any, serverURI:any,index?:number}>){
    return(
        <TableRow>
            <TableCell className="font-medium">{index+1}</TableCell>

            <TableCell className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={card.student.avatar ? (serverURI.slice(0, -1)+card.student.avatar) : ("")} />
                    <AvatarFallback>{`${card.student.first_name[0]}${card.student.last_name[0]}`}</AvatarFallback>
                </Avatar>

                {`${card.student.first_name} ${card.student.last_name}`}
            </TableCell>

            <TableCell>{format(card.date_submitted,"dd.MM.yyyy")}</TableCell>

            <TableCell>
                {compareDesc(card.homework.due_date,card.date_submitted)!=-1 ? (
                    <Badge variant={"secondary"}>{ua.homeworkPage.teacher.tableRow.late}</Badge>
                ) : (
                    <Badge variant={"outline"}>{ua.homeworkPage.teacher.tableRow.inTime}</Badge>
                )}
            </TableCell>

            <TableCell>
                {card.homework.homework_file && (
                <Button className="mr-2" variant={"outline"} size={"icon"} asChild>
                    <a href={`${serverURI.slice(0, -1)}${card.homework.homework_file}`} target="_blank" download><Download size={20}/></a>
                </Button>
                )}
                {card.homework.description && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size={"icon"} variant={"outline"}><MessageCircleMore size={20}/></Button>
                    </PopoverTrigger>
                    <PopoverContent>{card.homework.description}</PopoverContent>
                </Popover>
                )}
            </TableCell>

            <TableCell>
                {card.file && (
                    <Button variant={"secondary"} size={"icon"} asChild>
                        <a href={`${serverURI.slice(0, -1)}${card.file}`} target="_blank" download><Download size={20}/></a>
                    </Button>
                )}
            </TableCell>

            <TableCell className="text-right">
                {card.grade ? (
                    <Badge>{card.grade}</Badge>
                ) : <Badge variant={"destructive"}>{ua.homeworkPage.teacher.tableRow.notMarked}</Badge>}
            </TableCell>

        </TableRow>
    )
}