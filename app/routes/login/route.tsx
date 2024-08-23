import { redirect, type ActionFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { userCookie } from "~/utils/cookies";

export const meta: MetaFunction = () => {
    return [
        { title: "Вхід" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

import { LoginForm } from "@/components/login/LoginForm";

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
            console.log(data_res);

            return json({
                error: false,
                message: `Привіт, ${data_res.user_data.first_name}`,
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
        
        <div className="grid grid-cols-5">
        
            <div className="bg-white col-span-2 min-h-screen flex justify-center">
                <div className="w-full max-w-md flex flex-col justify-between gap-12 min-h-full py-8">
                    <img src="/ITBoost_Logo.svg" alt="Main logo" className="h-12 w-fit" />
                    
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-0">
                            <p className="text-lg text-gray-500 leading-tight">Увійдіть до кабінету щоб розпочати роботу</p>
                            <h1 className="font-display text-6xl text-gray-950 leading-tight">Навчальна платформа <span className='text-violet-500'>ITBoost</span></h1>
                        </div>
                        
                        <LoginForm/>
                    </div>
                    
                    <p>Some links</p>
                </div>
            </div>
            
            <div className="min-h-screen bg-cover col-span-3" style={ {backgroundImage: "url(https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"} }></div>
        </div>
        
    );
}
