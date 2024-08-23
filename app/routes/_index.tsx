import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import StudentDashboard from "@/components/app/dashboard/StudentDashboard";
import AppHeader from "@/components/app/misc/AppHeader";
import TeacherDashboard from "@/components/app/dashboard/TeacherDashboard";

export const meta: MetaFunction = () => {
    return [
        { title: "Dashboad" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};


export async function loader({ request }:LoaderFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    const response = await fetch(`${process.env.SERVER_HOST}education/dashboard/`,{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${cookie.access}`,
        },
    }).then( res => res.json() ).then( async (data_res:any) => {

        if (data_res.detail){
            throw new Error(data_res.detail);
        }else{
            console.log(data_res);

            return ({
                error: false,
                data: data_res,
                user_data: cookie.user_data
            })
        }
        
    }).catch( (error:any) => {
        //ERROR
        console.log(error)
        return ({
            error: true,
            message: error.message
        })
    })

    return response;
}

export default function Index() {
    let dashboard_data:any = useLoaderData();
    const [isLoading,SetIsLoading] = useState(true);

    useEffect( () => {
        SetIsLoading(false);
    }, [dashboard_data])
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && (<p>loading</p>)}
            {!isLoading && (
                <div className="flex flex-col gap-6">
                    <AppNavigation role={dashboard_data.user_data.role} name={dashboard_data.user_data.first_name} surname={dashboard_data.user_data.last_name} avatar={dashboard_data.user_data.avatar}/>

                    <AppHeader subtitle="Головна" title={`Привіт, ${dashboard_data.user_data.first_name}!`} />

                    {dashboard_data.user_data.role=="student" && (
                        <StudentDashboard average_mark={dashboard_data.data.average_mark} homeworks={dashboard_data.data.homeworks} lesson_in_month={dashboard_data.data.lesson_in_month} lesson_visited={dashboard_data.data.lesson_visited}/>
                    )}

                    {dashboard_data.user_data.role=="teacher" && (
                        <TeacherDashboard homeworks_count={dashboard_data.data.homeworks_count}/>
                    )}
                </div>
            )}
        </div>
    );
}
