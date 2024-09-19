import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { userCookie } from "~/utils/cookies";
import { useToast } from "@/components/ui/use-toast"

import { useState, useEffect } from "react";

import AppNavigation from "@/components/app/navigation/Navigation";
import AppHeader from "@/components/app/misc/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const meta: MetaFunction = () => {
    return [
        { title: "Dashboad" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

import { ua } from "../translation";
import { Loader } from "lucide-react";

export async function action({request}:ActionFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    const body = await request.formData();

    const response = await fetch(`${process.env.SERVER_HOST}user/profile/`,{
        method:"PUT",
        headers:{
            "Authorization":`Bearer ${cookie.access}`,
        },
        body: body
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
        
    }).catch( async (error:any) => {
        //ERROR
        console.log(error)
        return redirect("/login",{
            headers: {
                "Set-Cookie": await userCookie.serialize({}),
            },
        })
    })

    return  response
}

export async function loader({ request }:LoaderFunctionArgs){
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userCookie.parse(cookieHeader)) || null;

    if (!cookie) { return redirect("/login");} 

    const response = await fetch(`${process.env.SERVER_HOST}user/profile/`,{
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
                user_data: cookie.user_data,
                serverURI : process.env.SERVER_HOST,
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

    return  response
}

export default function MaterialPage() {
    let static_data:any = useLoaderData();
    let actioin_data:any = useActionData();
    const [isLoading,SetIsLoading] = useState(true);
    const [isSubmited,setIsSubmited] = useState(false);
    const { toast } = useToast()

    useEffect( () => {
        SetIsLoading(false);
    }, [static_data])

    useEffect( () => {
        console.log(actioin_data)
        if (isSubmited){
            setIsSubmited(false);
            toast({
                title:ua.settings.toast.title,
                description: ua.settings.toast.description
            })
        }
    }, [actioin_data] )


    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && (<p>loading</p>)}
            {!isLoading && (
                <div className="flex flex-col gap-6 pb-20 lg:pb-0">
                    <AppNavigation role={static_data.user_data.role} name={static_data.user_data.first_name} surname={static_data.user_data.last_name} avatar={static_data.user_data.avatar} serverURI={static_data.serverURI}/>

                    <AppHeader subtitle={ua.settings.pageSubtitle} title={`${ua.settings.pageName} ${static_data.user_data.first_name}!`} />

                    <div className="flex justify-center px-4 lg:px-0">
                        <div className="block-size flex justify-center">
                            <div className={cn(
                                "px-4 py-8 bg-white rounded-md border border-gray-200 shadow-sm min-h-[450px] duration-150 flex flex-col gap-4",
                                "w-full lg:w-1/3"
                            )}>

                                <div className="flex justify-center">
                                    <div className=" size-52 rounded-full overflow-hidden relative bg-slate-200">
                                        {static_data.data.avatar ? (
                                        <img src={static_data.data.avatar} className="w-full h-full object-cover"/>
                                        ) : (
                                        <p className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 text-2xl">
                                            {static_data.data.first_name[0]}{static_data.data.last_name[0]}
                                        </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex gap-6">
                                    <div className="flex flex-col w-full">
                                        <p className=" text-sm text-slate-500">{ua.settings.fields.name}</p>
                                        <p className=" text-lg text-slate-900 font-medium">
                                            {static_data.data.first_name} {static_data.data.last_name}
                                        </p>
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <p className=" text-sm text-slate-500">{ua.settings.fields.role}</p>
                                        <Badge className="w-fit">{static_data.data.role}</Badge>
                                    </div>
                                </div>
                                
                                {static_data.user_data.role=="student" && (
                                    <div className="flex flex-col w-full">
                                        <p className=" text-sm text-slate-500">{ua.settings.fields.age}</p>
                                        <p className=" text-lg text-slate-900 font-medium">
                                            {static_data.data.age}
                                        </p>
                                    </div>
                                )}

                                <Form onSubmit={ () => setIsSubmited(true) } className="flex flex-col gap-4" method="POST" encType="multipart/form-data">
                                    <div className="flex flex-col">
                                        <p className=" text-sm text-slate-500">{ua.settings.fields.photo}</p>
                                        <Input type="file" name="avatar"></Input>
                                    </div>

                                    <div className="flex flex-col">
                                        <p className=" text-sm text-slate-500">{ua.settings.fields.phoneNumber}</p>
                                        <Input type="text" name="phone_number" defaultValue={static_data.data.phone_number}></Input>
                                    </div>

                                    <div className="flex flex-col">
                                        <p className=" text-sm text-slate-500">{ua.settings.fields.mail}</p>
                                        <Input type="text" name="email" defaultValue={static_data.data.email}></Input>
                                    </div>
                                    
                                    {static_data.user_data.role=="teacher" && (
                                        <div className="flex flex-col">
                                            <p className=" text-sm text-slate-500">{ua.settings.fields.bio}</p>
                                            <Textarea name="bio" defaultValue={static_data.data.bio}></Textarea>
                                        </div>
                                    )}

                                    <Button>{isLoading  ? (<Loader size={20}/>) : ua.settings.fields.submit}</Button>
                                </Form>
                            
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
