import { Button } from "@/components/custom/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router";


export default function Client() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-white dark:bg-[#0f172a]">
            <div className="container flex flex-col gap-8 py-6 px-8">
                <div className="header flex items-center justify-between">
                    <div className="text">
                        <h3 className="text-2xl font-bold text-[#0f172a] dark:text-[#f8fafc]">Clients</h3>
                        <p className="text-sm text-[#64748b] dark:text-[#94a2b9]">Manage your client relationships</p>
                    </div>
                    <div className="button">
                        <Button variant="primary" text="Add Client" onClick={() => {
                            navigate("/add-client")
                        }} />
                    </div>
                </div>
                <div className="table w-full rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
            </div>
        </div>
    )
}
