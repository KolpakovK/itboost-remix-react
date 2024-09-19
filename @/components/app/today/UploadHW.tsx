import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@remix-run/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useActionData } from "@remix-run/react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

import { ua } from "~/routes/translation"

export default function UploadHomeWork({lesson,lessonTitle}:Readonly<{lesson:number,lessonTitle:string}>){
    let action_data:any = useActionData();

    const [isOpened,setIsOpened]:any = useState(false);
    const [fileIsAllowed,setFileIsAllowed]:any = useState(true);
    
    function onFileSelectedHandler(e:any){
        const files = e.target.files[0];
        if(files.size > 5000000) {
            setFileIsAllowed(false)
        }
        else{
            setFileIsAllowed(true)
        }
    }

    useEffect( () => {
        if (action_data){
            if (action_data.type){
                if (action_data.type=="toast"){
                    setIsOpened(false);
                }
            }
        }
        
    }, [action_data] );
 
    return (
        <Dialog open={isOpened} onOpenChange={(open:boolean) => setIsOpened(open)}>
            <DialogTrigger asChild><Button variant={"secondary"}>{ua.today.uploadHW.trigger}</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ua.today.uploadHW.title}</DialogTitle>
                    <DialogDescription>{ua.today.uploadHW.description}</DialogDescription>
                </DialogHeader>

                <Form method="POST" className="flex flex-col gap-8" encType="multipart/form-data">
                    <input type="text" readOnly name="lesson" defaultValue={lesson} className=" hidden"/>
                    <input type="text" readOnly name="type" defaultValue={"uploadHomeWork"} className=" hidden"/>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label>{ua.today.uploadHW.fields.theme}</Label>
                            <Input type="text" name="title" defaultValue={lessonTitle}/>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>{ua.today.uploadHW.fields.description}</Label>
                            <Textarea name="description"/>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label>{ua.today.uploadHW.fields.dueDate}</Label>
                            <Input type="date" name="due_date"/>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label>{ua.today.uploadHW.fields.file}</Label>
                            <Input onChange={ (e:any) => onFileSelectedHandler(e) } type="file" name="homework_file"/>
                            <p className=" text-sm text-gray-500">{ua.today.uploadHW.fields.fileHint}</p>
                        </div>
                    </div>

                    <div className={cn( !fileIsAllowed && " pointer-events-none opacity-50" )}>
                        <Button>{ua.today.uploadHW.fields.submit}</Button>
                    </div>
                </Form>

            </DialogContent>
        </Dialog>
    )
}