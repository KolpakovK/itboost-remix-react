import { redirect, type ActionFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { userCookie } from "~/utils/cookies";

export const meta: MetaFunction = () => {
    return [
        { title: "Вхід" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

import { LoginForm } from "@/components/login/LoginForm";

import { ua } from "../translation";

export async function action({
    request,
}: ActionFunctionArgs) {
    const data:any = await request.formData();
    
    const response = await fetch(`${process.env.SERVER_HOST}user/token/`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({username:data.get("username"),password:data.get("password")})
    }).then( res => res.json() ).then( async (data_res:any) => {

        if (data_res.detail){
            throw new Error(data_res.detail);
        }else{

            return json({
                error: false,
                message: `${ua.login.toast} ${data_res.user_data.first_name}`,
            },{
                headers: {
                    "Set-Cookie": await userCookie.serialize(data_res),
                },
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

    return response
    
}

export default function LoginPage() {
    return (
        
        <div className="flex flex-col-reverse lg:grid grid-cols-5">
        
            <div className="bg-white col-span-2 lg:min-h-screen flex justify-center">
                <div className="w-full max-w-md flex flex-col lg:justify-between gap-8 lg:gap-12 h-fit lg:min-h-full py-8 px-4 lg:py-8">
                    <img src="/ITBoost_Logo.svg" alt="Main logo" className="h-12 w-fit absolute left-4 top-4 saturate-0 brightness-[600] lg:saturate-100 lg:brightness-100 lg:relative" />

                    
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <div className="flex flex-col gap-0">
                            <p className="text-sm lg:text-lg text-gray-500 leading-tight">{ua.login.greating}</p>
                            <h1 className="font-display text-4xl lg:text-6xl text-gray-950 leading-tight">{ua.login.headline[0]} <span className='text-violet-500'>{ua.login.headline[1]}</span></h1>
                        </div>
                        
                        <LoginForm/>
                    </div>
                    
                    <p className=" text-sm text-slate-500">{ua.login.legal[0]} <a href="/legal" className=" text-violet-500">{ua.login.legal[1]}</a></p>
                </div>
            </div>
            
            <div className="h-[275px] lg:min-h-screen bg-cover col-span-3 rounded-b-3xl lg:rounded-none" style={ {backgroundImage: "url(https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"} }></div>
        </div>
        
    );
}
