import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import StudentDashboard from "@/components/app/dashboard/StudentDashboard";
import AppHeader from "@/components/app/misc/AppHeader";
import TeacherDashboard from "@/components/app/dashboard/TeacherDashboard";

import { ua } from "./translation";

export const meta: MetaFunction = () => {
    return [
        { title: "Головна" },
        { name: "description", content: "Платформа онлайн навчання" },
    ];
};


export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await userCookie.parse(cookieHeader) || null;
    
    if (!cookie) {
        return redirect("/login");
    }

    const serverURI = process.env.SERVER_HOST;

    try {
        const response = await fetch(`${serverURI}education/dashboard/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${cookie.access}`,
            },
        });

        const data_res = await response.json();

        if (data_res.detail) {
            throw new Error(data_res.detail);
        }

        return {
            error: false,
            data: data_res,
            user_data: cookie.user_data,
            serverURI,
        };
    } catch (error) {
        console.error(error);

        // Clear cookies and redirect to login on error
        return redirect("/login", {
            headers: {
                "Set-Cookie": await userCookie.serialize({}),
            },
        });
    }
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
                <div className="flex flex-col gap-6 pb-20 lg:pb-0">
                    <AppNavigation role={dashboard_data.user_data.role} name={dashboard_data.user_data.first_name} surname={dashboard_data.user_data.last_name} avatar={dashboard_data.user_data.avatar} serverURI={dashboard_data.serverURI}/>

                    <AppHeader subtitle={ua.dashboard.pageSubtitle} title={`${ua.dashboard.pageName} ${dashboard_data.user_data.first_name}!`} />

                    {dashboard_data.user_data.role=="student" && (
                        <StudentDashboard future_lessons={dashboard_data.data.future_lessons} average_mark={dashboard_data.data.average_mark} homeworks={dashboard_data.data.homeworks} lesson_in_month={dashboard_data.data.lesson_in_month} lesson_visited={dashboard_data.data.lesson_visited}/>
                    )}

                    {dashboard_data.user_data.role=="teacher" && (
                        <TeacherDashboard homeworks_count={dashboard_data.data.homeworks_count} future_lessons={dashboard_data.data.future_lessons}/>
                    )}
                </div>
            )}
        </div>
    );
}
