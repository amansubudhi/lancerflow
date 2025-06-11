import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/custom/button";
import { Plus, Trash2 } from "lucide-react";
import { Calendar28 } from "@/components/custom/calendar2";


const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    notes: z.string().optional(),
    deadline: z.coerce.date(),
    services: z.array(z.object({
        name: z.string(),
        price: z.number().nonnegative()
    })).optional()
})


export default function AddClient() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            companyName: "",
            phone: "",
            notes: "",
            deadline: new Date(),
            services: [{ name: "", price: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "services"
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <div className="min-h-screen w-full bg-white dark:bg-[#0f172a]">
            <div className="container mx-auto max-w-2xl border rounded-md flex flex-col gap-8 py-6 px-8">
                <div>
                    <h3 className="text-2xl font-semibold text-[#0f172a] dark:text-[#f8fafc]">Add New Client</h3>
                    <p className="text-sm text-[#64748b] dark:text-[#94a2b9]">Create a new client project and start your workflow</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full space-y-8">
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Client Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter client name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Client Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter client Email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <FormLabel>Services</FormLabel>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`services.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Service name" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`services.${index}.price`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Price" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        onClick={() => append({ name: "", price: 0 })}
                                        className="mt-2"
                                        icon={<Plus size={16} />}
                                        text="Add Service"
                                    />
                                </div>



                                <FormField
                                    control={form.control}
                                    name='deadline'
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Project deadline</FormLabel>
                                            <FormControl>
                                                <Calendar28 {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='notes'
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Optional notes</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Any additional notes about the project..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </div>
                            <div className="mt-6">
                                <Button type="submit" text="Start Project" />
                            </div>
                        </form>
                    </Form>
                </div>

            </div>
        </div>
    )
}
