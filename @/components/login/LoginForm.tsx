import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useNavigate, useActionData } from "@remix-run/react"
import { useSubmit } from "@remix-run/react"

import { useState, useEffect } from "react"

import { useToast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"

const FormSchema = z.object({
    username: z.string().min(5, {
        message: "Мінімальна довжина - 5 символів",
    }),
    password: z.string().min(5, {
        message: "Мінімальна довжина - 5 символів",
    }),
})


export function LoginForm() {
    const { toast } = useToast()
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false);

    let serverResponse:any = useActionData();

    const submit = useSubmit();

    useEffect( () => {

        if (serverResponse){
            toast({
                title:serverResponse.error ? "Помилка!" : "Успіх!",
                description: serverResponse.message,
                variant:serverResponse.error ? "destructive" : "default",
            })

            if (!serverResponse.error) navigate("/");
        }
        setIsLoading(false);

    }, [serverResponse])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password:""
        },
    })
    
    function onSubmit(data: z.infer<typeof FormSchema>,e:any) {
        submit(e.target, { method: "post" });
        setIsLoading(true);
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:gap-8" method="post">
                <div className="flex flex-col gap-4">
                    <FormField control={form.control} name="username" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ім'я користувача</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Забули пароль? Скористайтесь <a href="#" className="text-violet-500">посиланням</a> для його віддновлення.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>


                <Button type="submit">{isLoading  ? (<Loader size={20}/>) : "Увійти"}</Button>
            </form>
        </Form>
    )
}
