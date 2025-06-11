import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { config } from "@/config";
import axios from "axios";


const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().optional(),
    provider: z.enum(["LOCAL", "GOOGLE"]),
    providerId: z.string().optional()
})


export default function Signin() {
    const form = useForm<z.infer<typeof SigninSchema>>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: "",
            provider: "LOCAL",
        },
    })


    async function onSubmit(values: z.infer<typeof SigninSchema>) {
        console.log(values)
        try {
            const res = await axios.post(`${config.PRIMARY_BACKEND_URL}/api/v1/user/signin`,
                values, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const token = res.data?.accessToken;
            localStorage.setItem("token", token);
            console.log("Signed in successfully!");

        } catch (err: any) {
            if (err.response) {
                const msg = err.response.data?.message;

                if (msg === "Incorrect Inputs") {
                    console.log("Incorrect Inputs");
                } else if (msg === "Invalid email or password") {
                    console.log("Invalid email or password");
                } else {
                    console.log("Error from backend:", err.response.data);
                }
            } else {
                console.log("Unexpected error:", err.message || err);
            }
        }
    }
    return (
        <div className="min-h-screen w-full bg-white dark:bg-[#0f172a]">
            <div className="container mx-auto max-w-2xl border rounded-md flex flex-col gap-8 py-6 px-8">
                <div>
                    <h3 className="text-2xl font-semibold text-[#0f172a] dark:text-[#f8fafc]">Login to your account</h3>
                    {/* <p className="text-sm text-[#64748b] dark:text-[#94a2b9]">Create a new client project and start your workflow</p> */}
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full space-y-8">
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter your Email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter your password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-6">
                                <Button type="submit" text="Signin" />
                            </div>
                        </form>
                    </Form>
                </div>

            </div>
        </div>
    )
}
