import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";
import { format, getMonth, parseISO } from "date-fns";

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import CalendarScreen from "@/components/app/calendar/CalendarScreen";

export const meta: MetaFunction = () => {
    return [
        { title: "Календар" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

import { ua } from '~/routes/translation'

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await userCookie.parse(cookieHeader) || null;

    if (!cookie) return redirect("/login");

    const data = await request.formData();
    const startDate:any = data.get("start_data");
    const endDate:any = data.get("end_data");
    const serverURI = process.env.SERVER_HOST;
    const url = `${serverURI}education/schedule/?start_date=${startDate}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${cookie.access}`,
            },
        });

        const data_res = await response.json();

        if (data_res.detail) {
            throw new Error(data_res.detail);
        }

        let data_first = data_res;

        const startMonth = getMonth(startDate);
        const endMonth = getMonth(endDate);

        let data_second = null;

        if (startMonth != endMonth) {

            const url_second = `${serverURI}education/schedule/?start_date=${endDate}`;

            try{
                const response_second = await fetch(url_second, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${cookie.access}`,
                    },
                });

                const data_res_second = await response_second.json();

                if (data_res_second.detail) {
                    throw new Error(data_res_second.detail);
                }

                data_second = data_res_second;
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


        let combinedData = data_first;
        if (data_second != null){
            combinedData = {
                month: [...data_first.month, ...data_second.month]
            }
        }
        
        return {
            error: false,
            data: combinedData,
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


export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = await userCookie.parse(cookieHeader) || null;

    if (!cookie) {
        return redirect("/login");
    }

    const serverURI = process.env.SERVER_HOST;

    return {
        user_data: cookie.user_data,
        serverURI,
    };
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
                    <AppNavigation role={static_data.user_data.role} name={static_data.user_data.first_name} surname={static_data.user_data.last_name} avatar={static_data.user_data.avatar} serverURI={static_data.serverURI}/>

                    <AppHeader title={ua.calendar.pageName} />

                    <CalendarScreen serverURI={static_data.serverURI}/>
                </div>
            )}
        </div>
    );
}
