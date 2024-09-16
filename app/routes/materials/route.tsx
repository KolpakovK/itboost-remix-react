import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const meta: MetaFunction = () => {
    return [
        { title: "Dashboad" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function action({request}:ActionFunctionArgs){
    const body:any = await request.formData().then( (data:any) => { return data }).catch( error => null);
    if (body) console.log(body.get("id"));

    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    if (cookie.user_data.role=="student") { return redirect("/");} 

    const response = await fetch(`${process.env.SERVER_HOST}courses/courses-materials/${ body.get("id") ? `?course_id=${body.get("id")}` : "" }`,{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${cookie.access}`,
        },
    }).then( res => res.json() ).then( async (data_res:any) => {

        if (data_res.detail){
            throw new Error(data_res.detail);
        }else{
            return ({
                error: false,
                data: data_res,
                serverURI : process.env.SERVER_HOST,
                user_data: cookie.user_data
            })
        }
        
    }).catch( async (error:any) => {
        //ERROR
        console.log(error)
        return redirect("/login",{
            headers: {
                "Set-Cookie": await userCookie.serialize({}),
            },
        })
    })

    return response;
}

export async function loader({ request }:LoaderFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    if (cookie.user_data.role=="student") { return redirect("/");} 

    return {
        user_data: cookie.user_data,
        serverURI : process.env.SERVER_HOST,
    };
}

export default function MaterialPage() {
    let static_data:any = useLoaderData();
    let actioin_data:any = useActionData();
    const [isLoading,SetIsLoading] = useState(true);
    const submit = useSubmit();

    useEffect( () => {
        SetIsLoading(false);

        if (!actioin_data){   
            submit({},{method:"POST"});
        }
    }, [static_data])

    useEffect( () => {
        console.log(actioin_data)
    }, [actioin_data] )


    function updateSelectedCourse(id:string){
        console.log(id)
        submit({id:id},{method:"POST"});
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && (<p>loading</p>)}
            {!isLoading && (
                <div className="flex flex-col gap-6">
                    <AppNavigation role={static_data.user_data.role} name={static_data.user_data.first_name} surname={static_data.user_data.last_name} avatar={static_data.user_data.avatar} serverURI={static_data.serverURI}/>

                    <AppHeader subtitle="Тут ви знайдете всі актуальні матеріали" title={`Матеріали для занять`} />

                    {actioin_data && (
                    <>
                        {actioin_data.data.current_course && (
                        <div className="flex items-center flex-col gap-4 px-4 lg:px-0 pb-20 lg:pb-0">
                            <div className=" block-size">

                                <div className="flex items-center gap-2">
                                    <Label>Матеріал:</Label>
                                    <Select defaultValue={actioin_data.data.current_course.id} onValueChange={ (v:string) => updateSelectedCourse(v) }>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Оберіть" />
                                        </SelectTrigger>
                                        <SelectContent>

                                            {actioin_data.data.courses.map( (course:any,index:number) => (
                                                <SelectItem key={index} value={course.id}>{course.title}</SelectItem>
                                            ) )}
                                            
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                            <div className="block-size grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-6">
                                {actioin_data.data && ( 
                                <>
                                    {actioin_data.data.current_course.materials.map( (material:any,index:number) => (
                                        <div className="p-3 lg:p-6 rounded-md bg-white border border-slate-300 flex flex-col gap-2" key={index}>
                                            <Badge variant={"secondary"} className="w-fit">{index+1}</Badge>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">{material.title}</p>
                                            <p className=" text-slate-900">{material.desc}</p> 
                                            {material.pdf_file && (
                                                <Button size={"sm"} className="w-fit" asChild>
                                                    <a href={`${actioin_data.serverURI.slice(0, -1)}${material.pdf_file}`} target="_blank" download>Завантажити</a>
                                                </Button>
                                            )}
                                        </div>
                                    ) )}
                                </> )}
                            </div>
                        </div>
                        )}
                    </>
                    )}
                </div>
            )}
        </div>
    );
}
