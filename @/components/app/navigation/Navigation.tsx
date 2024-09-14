import { Link, useLocation } from "@remix-run/react"; 

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

function getInitials(fullName:string) {
    const initials = fullName.match(/\b\w/g) || []; // \b - граница слова, \w - любой буквенный символ
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

const _navigation_items:any = {
    student:[
        {
            label:"Головна",
            link:"/"
        },
        {
            label:"Календар",
            link:"/calendar"
        },
        {
            label:"Домашні завдання",
            link:"/homework"
        },
        {
            label:"Активність",
            link:"/activity"
        },
    ],
    teacher:[
        {
            label:"Головна",
            link:"/"
        },
        {
            label:"Заняття на сьогодні",
            link:"/today"
        },
        {
            label:"Календар",
            link:"/calendar"
        },
        {
            label:"Домашні завдання",
            link:"/homework"
        },
        {
            label:"Студенти",
            link:"/students"
        },
        {
            label:"Матеріали",
            link:"/materials"
        },
    ],
}

const _dropdown_menu:any = [
    {
        type   :  "title",
        value  :  "Мій акаунт",
        link   :  null
    },
    {
        type   :  "link",
        value  :  "Налаштування",
        link   :  "/user-settings"
    },
    {
        type   :  "separator",
        value  :  null,
        link   :  null
    },
    {
        type   :  "link",
        value  :  "Вийти",
        link   :  "/login"
    },
]

export default function AppNavigation({ role,name,surname,avatar="",serverURI=""}:Readonly<{role:string,avatar:string,name:string,surname:string,serverURI?:string}>){
    const location = useLocation();

    return (
        <div className="flex justify-center bg-white border-b border-gray-200 px-4 lg:px-0">
            <div className="block-size flex justify-between items-center py-3">
                <a href="/">
                    <img src="/ITBoost_Logo.svg" alt="Main logo" className="h-8 w-fit"/>
                </a>
                

                <div className="items-center gap-1 hidden lg:flex">
                    {_navigation_items[role].map( (nav_item:any,index:number) => (
                        <Button key={index} variant={ nav_item.link==location.pathname ? "secondary" : "ghost" } asChild><Link to={nav_item.link}>{ nav_item.label }</Link></Button>
                    ) )}
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="capitalize">{role}</Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={serverURI.slice(0, -1)+avatar} />
                                <AvatarFallback>{getInitials(`${name} ${surname}`)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className="block lg:hidden">
                                <DropdownMenuLabel>Навігація</DropdownMenuLabel>
                                {_navigation_items[role].map( (nav_item:any,index:number) => (
                                    <DropdownMenuItem key={index} asChild><Link to={nav_item.link}>{nav_item.label}</Link></DropdownMenuItem>
                                ) )}
                                <DropdownMenuSeparator />
                            </div>

                            {_dropdown_menu.map( (dropdown_item:any,index:number) => (
                                <div key={index}>
                                    {dropdown_item.type=="title" && (<DropdownMenuLabel>{dropdown_item.value}</DropdownMenuLabel>)}
                                    {dropdown_item.type=="separator" && (<DropdownMenuSeparator />)}
                                    {dropdown_item.type=="link" && (<DropdownMenuItem asChild><Link to={dropdown_item.link}>{dropdown_item.value}</Link></DropdownMenuItem>)}
                                </div>
                            ))}
                        </DropdownMenuContent>
                        
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}