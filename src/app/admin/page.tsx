import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export default function AdminDashboard() {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
            <CardHeader>Sales</CardHeader>
            <CardDescription>desc</CardDescription>
            <CardContent><p>text</p></CardContent>
        </Card>
    </div>
}