import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";
import { format } from "date-fns";

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import CalendarScreen from "@/components/app/calendar/CalendarScreen";

export const meta: MetaFunction = () => {
    return [
        { title: "Calendar" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function action({ request }:ActionFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    const data:any = await request.formData();

    const response = await fetch(`${process.env.SERVER_HOST}education/schedule/?start_date=${ data.get("start_data") }`,{
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

    let result = cookie.user_data;

    return result;
}

export default function CalendarPage() {

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
                    <AppNavigation role={static_data.role} name={static_data.first_name} surname={static_data.last_name} avatar={static_data.avatar}/>

                    <AppHeader title={`Календар занять`} />

                    <CalendarScreen/>
                </div>
            )}
        </div>
    );
}
