import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";
import { format } from "date-fns";

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import { HomeworkStudentListing,HomeworkTeacherListing } from "@/components/app/homework/homeworkListing";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ua } from "../translation";

export const meta: MetaFunction = () => {
    return [
        { title: "Homeworks" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function action({ request }:ActionFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    const data:any = await request.formData();

    let response:any = {}

    if (data.get("type")=="getHomework"){

        response = await fetch(`${process.env.SERVER_HOST}education/homework/to_check/`,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
            },
        }).then( res => res.json() ).then( async (data_res:any) => {

            if (data_res.detail){
                throw new Error(data_res.detail);
            }else{
                return ({
                    error     : false,
                    type      : "to-do",
                    serverURI : process.env.SERVER_HOST,
                    data      : data_res,
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
    }

    if (data.get("type")=="getAllHomework"){

        if (cookie.user_data.role == "teacher"){

            response = await fetch(`${process.env.SERVER_HOST}education/homework/all_teachers_homeworks/${ data.get("group_id") ? `?group_id=${data.get("group_id")}` : "" }${ data.get("course_id") ? `&course_id=${data.get("course_id")}` : ""}`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${cookie.access}`,
                },
            }).then( res => res.json() ).then( async (data_res:any) => {
    
                if (data_res.detail){
                    throw new Error(data_res.detail);
                }else{
                    return ({
                        error     : false,
                        type      : "all",
                        serverURI : process.env.SERVER_HOST,
                        data      : data_res,
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
        }

        if (cookie.user_data.role == "student"){
            response = await fetch(`${process.env.SERVER_HOST}education/homework/all_students_homeworks/${ data.get("course_id") ? `?course_id=${data.get("course_id")}` : "" }`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${cookie.access}`,
                },
            }).then( res => res.json() ).then( async (data_res:any) => {
    
                if (data_res.detail){
                    throw new Error(data_res.detail);
                }else{
                    return ({
                        error     : false,
                        type      : "all",
                        serverURI : process.env.SERVER_HOST,
                        data      : data_res,
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
        }
        
    }

    if (data.get("type")=="uploadHomework"){
        
        response = await fetch(`${process.env.SERVER_HOST}education/submission/to_send/`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
            },
            body:data
        }).then( res => res.json() ).then( async (data_res:any) => {
            if (data_res.detail){
                if (data_res.detail=="Given token not valid for any token type") throw new Error(data_res.detail);
                return {
                    error:true,
                    data:data_res.detail
                }
            }else{
                return ({
                    error     : false,
                    type      : "uploaded",
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
        
    }

    if (data.get("type")=="setMark"){
        
        response = await fetch(`${process.env.SERVER_HOST}education/submission/set_mark/`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${cookie.access}`,
            },
            body:data
        }).then( res => res.json() ).then( async (data_res:any) => {
            if (data_res.detail){
                if (data_res.detail=="Given token not valid for any token type") throw new Error(data_res.detail);
                return {
                    error:true,
                    data:data_res.detail
                }
            }else{
                return ({
                    error     : false,
                    type      : "uploaded",
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
        
    }

    return response;
}

export async function loader({ request }:LoaderFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    let result = {
        user_data : cookie.user_data,
        serverURI : process.env.SERVER_HOST,
    };

    return result;
}

export default function HomeworkPage() {
    const submit = useSubmit();
    const { toast } = useToast()
    let static_data:any = useLoaderData();
    let action_data:any = useActionData();
    
    const [isLoading,SetIsLoading] = useState(true);
    const [selectedView,setSelectedView] = useState("to-do");

    useEffect( () => {
        if (action_data){
            if (action_data.error){
                toast({
                    variant:"destructive",
                    title:ua.homeworkPage.toastError,
                    description:action_data.data
                })
            }
        }
    }, [action_data] )

    useEffect( () => {
        SetIsLoading(false);
    }, [static_data])

    useEffect( () => {
        if (selectedView=="to-do"){
            submit({type:"getHomework"},{method:"POST"})
        }
        else{
            submit({type:"getAllHomework"},{method:"POST"})
        }
    }, [selectedView])
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && (<p>loading</p>)}
            {!isLoading && (
                <div className="flex flex-col gap-6 pb-20 lg:pb-0">
                    <AppNavigation role={static_data.user_data.role} name={static_data.user_data.first_name} surname={static_data.user_data.last_name} avatar={static_data.user_data.avatar} serverURI={static_data.serverURI}/>

                    <AppHeader title={ua.homeworkPage.pageName}>
                        <Tabs defaultValue="to-do" onValueChange={ (v:string) => setSelectedView(v) }>
                            <TabsList>
                                <TabsTrigger value="to-do">{ua.homeworkPage.tabs[0]}</TabsTrigger>
                                <TabsTrigger value="all">{ua.homeworkPage.tabs[1]}</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </AppHeader>

                    {static_data.user_data.role=="student" && (
                        <HomeworkStudentListing selectedView={selectedView}/>
                    )}

                    {static_data.user_data.role=="teacher" && (
                        <HomeworkTeacherListing selectedView={selectedView}/>
                    )}
                </div>
            )}
        </div>
    );
}
