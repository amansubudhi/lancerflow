import ClientSummary from "@/components/custom/clients/ClientSummary";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react"
import { useParams } from "react-router";

export function ClientDetails() {
    const [client, setClient] = useState<any>({});
    const { id } = useParams();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axiosInstance.get(`/api/v1/client/${id}`);
                console.log(res.data.clientDetail);
                setClient(res.data.clientDetail);
            } catch (err) {
                console.error("Failed to fetch clients", err);
            }
        };
        fetchClients();
    }, [id]);

    return (
        <div className="min-h-screen w-full bg-white dark:bg-[#0f172a]">
            <div className="container py-6 px-8 max-w-4xl mx-auto">
                <div className="card-container grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ClientSummary />
                        <ClientSummary />
                    </div>
                    <ClientSummary />

                </div>
            </div>

        </div>
    )
}