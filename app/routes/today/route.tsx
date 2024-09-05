import { useLoaderData, useActionData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect, ActionFunctionArgs, unstable_parseMultipartFormData, unstable_createFileUploadHandler, UploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { userCookie } from "~/utils/cookies";
import { useEffect, useState } from "react";
import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import TodaySchedule from "@/components/app/today/TodaySchedule";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertOctagon } from "lucide-react";

import { createWriteStream } from "fs";
import path from "path";

import { useToast } from "@/components/ui/use-toast"

export async function action({ request }:ActionFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 
    const data:any = await request.formData();

    let response = null;

    if (data.get("type")=="setTheme"){
        response = await fetch(`${process.env.SERVER_HOST}education/lessons/${data.get("lesson_id")}/theme/`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
                "Content-Type":"application/json",
            },
            body: JSON.stringify({title:data.get("lesson_theme"),description:data.get("lesson_theme")})
        }).then( res => res.json() ).then( async (data_res:any) => {

            if (data_res.detail){
                if (data_res.detail=="Given token not valid for any token type") throw new Error(data_res.detail);
                return {
                    error:true,
                    data:data_res.detail
                }
            }else{

                return {
                    error:false,
                    data:data_res
                }
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
    }

    if (data.get("type")=="checkStudent"){
        response = await fetch(`${process.env.SERVER_HOST}education/lessons/${data.get("lesson_id")}/check/${data.get("student_id")}/`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
                "Content-Type":"application/json",
            },
            body: JSON.stringify({is_present:data.get("is_present"),is_late:data.get("is_late")})
        }).then( res => res.json() ).then( async (data_res:any) => {

            if (data_res.detail){
                if (data_res.detail=="Given token not valid for any token type") throw new Error(data_res.detail);
                return {
                    error:true,
                    data:data_res.detail
                }
            }else{

                return {
                    error:false,
                    data:data_res
                }
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
    }

    if (data.get("type")=="markStudent"){
        response = await fetch(`${process.env.SERVER_HOST}education/lessons/${data.get("lesson_id")}/mark/${data.get("student_id")}/`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
                "Content-Type":"application/json",
            },
            body: JSON.stringify({grade_on_lesson:data.get("value")})
        }).then( res => res.json() ).then( async (data_res:any) => {

            if (data_res.detail){
                if (data_res.detail=="Given token not valid for any token type") throw new Error(data_res.detail);
                return {
                    error:true,
                    data:data_res.detail
                }
            }else{
                console.log(data_res);
                return {
                    error:false,
                    data:data_res
                }
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
    }

    if (data.get("type")=="uploadHomeWork"){

        response = await fetch(`${process.env.SERVER_HOST}education/homework/set/`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
            },
            body: data
        }).then( res => res.json() ).then( async (data_res:any) => {

            if (data_res.detail){
                if (data_res.detail=="Given token not valid for any token type") throw new Error(data_res.detail);
                return {
                    error:true,
                    data:data_res.detail
                }
            }else{
                console.log(data_res);
                return {
                    error:false,
                    type:"toast",
                    data:data_res.message
                }
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
    }

    return response;
}

export async function loader({ request }:LoaderFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    if (cookie.user_data.role!="teacher") { return redirect("/");} 

    const response = await fetch(`${process.env.SERVER_HOST}education/today-schedule/`,{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${cookie.access}`,
        },
    }).then( res => res.json() ).then( async (data_res:any) => {

        if (data_res.detail){
            throw new Error(data_res.detail);
        }else{
            console.log(data_res)

            return ({
                error: false,
                data: data_res,
                user_data:cookie.user_data,
            })
        }
        
    }).catch( async (error:any) => {
        //ERROR
        console.log(error)
        if (error.message!="No lessons found for today."){
            return redirect("/login",{
                headers: {
                    "Set-Cookie": await userCookie.serialize({}),
                },
            })
        }
        else{
            return ({
                error: true,
                data: null,
                user_data:cookie.user_data,
            })
        }
    })

    return response;
}

export default function TodayPage(){
    let static_data:any = useLoaderData();
    let action_data:any = useActionData();

    const { toast } = useToast()

    const [isLoading,SetIsLoading] = useState(true);

    useEffect( () => {
        SetIsLoading(false);
    }, [static_data])

    useEffect( () => {
        if (action_data){
            if (action_data.error){
                toast({
                    variant: "destructive",
                    title: "Ошибка!",
                    description: action_data.data,
                })
            }
            else{
                if (action_data.type){
                    if (action_data.type=="toast"){
                        toast({
                            title: "Готово!",
                            description: action_data.data,
                        })
                    }
                }
            }
        }
    }, [action_data] )

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && (<p>loading</p>)}
            {!isLoading && (
                <div className="flex flex-col gap-6">
                    {}
                    <AppNavigation role={static_data.user_data.role} name={static_data.user_data.first_name} surname={static_data.user_data.last_name} avatar={static_data.user_data.avatar}/>

                    <AppHeader subtitle="Оберіть заняття для початку" title={`Заняття на сьогодні`} />

                    {static_data.data ? (
                        <TodaySchedule/>
                    ) : (
                        <div className="flex justify-center">
                            <div className="block-size">
                                <Alert>
                                    <AlertOctagon className="size-4 !text-yellow-600" />
                                    <AlertTitle>У вас в графіку нема занять!</AlertTitle>
                                    <AlertDescription>
                                        Якщо ви впевнені, що у вас є назначені заняття - зверніться до адміністрації.
                                    </AlertDescription>
                                </Alert> 
                            </div>
                        </div>
                    )}

                    
                </div>
            )}
        </div>
    )
}