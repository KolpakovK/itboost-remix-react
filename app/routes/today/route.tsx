import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, redirect, ActionFunctionArgs } from "@remix-run/node";
import { userCookie } from "~/utils/cookies";
import { useEffect, useState } from "react";
import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import TodaySchedule from "@/components/app/today/TodaySchedule";

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
                throw new Error(data_res.detail);
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
            //console.log(data_res)

            return ({
                error: false,
                data: data_res,
                user_data:cookie.user_data,
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

export default function TodayPage(){
    const submit = useSubmit();
    let static_data:any = useLoaderData();

    const [isLoading,SetIsLoading] = useState(true);

    useEffect( () => {
        SetIsLoading(false);
    }, [static_data])

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && (<p>loading</p>)}
            {!isLoading && (
                <div className="flex flex-col gap-6">
                    {}
                    <AppNavigation role={static_data.user_data.role} name={static_data.user_data.first_name} surname={static_data.user_data.last_name} avatar={static_data.user_data.avatar}/>

                    <AppHeader subtitle="Оберіть заняття для початку" title={`Заняття на сьогодні`} />

                    <TodaySchedule/>
                </div>
            )}
        </div>
    )
}