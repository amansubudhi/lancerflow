import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientSummary() {
    return (
        <div className="card-container">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>client.name</CardTitle>
                        <CardDescription>client.email</CardDescription>
                    </div>
                    <div>Badge goes here</div>
                </CardHeader>
            </Card>
        </div>
    )
}
