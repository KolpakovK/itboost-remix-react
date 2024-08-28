import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@remix-run/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useActionData } from "@remix-run/react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"


export default function UploadHomeWork({lesson}:Readonly<{lesson:number}>){
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
            <DialogTrigger asChild><Button variant={"secondary"}>Домашня робота</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Завантажити роботу</DialogTitle>
                    <DialogDescription>
                        Введіть тему, додайте опис та завантажте файл на перевірку.
                    </DialogDescription>
                </DialogHeader>

                <Form method="POST" className="flex flex-col gap-8" encType="multipart/form-data">
                    <input type="text" readOnly name="lesson" value={lesson} className=" hidden"/>
                    <input type="text" readOnly name="type" value={"uploadHomeWork"} className=" hidden"/>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label>Тема</Label>
                            <Input type="text" name="title"/>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Опис</Label>
                            <Textarea name="description"/>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label>Виповнити до</Label>
                            <Input type="date" name="due_date"/>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label>Файл</Label>
                            <Input onChange={ (e:any) => onFileSelectedHandler(e) } type="file" name="homework_file"/>
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