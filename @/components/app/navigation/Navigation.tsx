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
            link:"#"
        },
    ],
    teacher:[
        {
            label:"Головна",
            link:"/"
        },
        {
            label:"Заняття на сьогодні",
            link:"#"
        },
        {
            label:"Календар",
            link:"/calendar"
        },
        {
            label:"Домашні завдання",
            link:"#"
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
        type   :  "separator",
        value  :  null,
        link   :  null
    },
    {
        type   :  "link",
        value  :  "Налаштування",
        link   :  "#"
    },
    {
        type   :  "link",
        value  :  "Вийти",
        link   :  "/login"
    },
]

export default function AppNavigation({ role,name,surname,avatar="" }:Readonly<{role:string,avatar:string,name:string,surname:string}>){
    const location = useLocation();

    return (
        <div className="flex justify-center bg-white border-b border-gray-200">
            <div className="block-size flex justify-between items-center py-3">
                <img src="/ITBoost_Logo.svg" alt="Main logo" className="h-8 w-fit"/>

                <div className="flex items-center gap-0">
                    {_navigation_items[role].map( (nav_item:any,index:number) => (
                        <Button key={index} variant={ nav_item.link==location.pathname ? "secondary" : "ghost" } asChild><Link to={nav_item.link}>{ nav_item.label }</Link></Button>
                    ) )}
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="capitalize">{role}</Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={avatar} />
                                <AvatarFallback>{getInitials(`${name} ${surname}`)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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