import { ShieldX } from "lucide-react";
import { Card, CardBody } from "@heroui/react";

export default function UnauthorizedAlert() {
    return (
        <div className="max-w-7xl mx-auto">
            <Card className="bg-danger-50 border border-danger-200">
                <CardBody className="flex flex-row items-center gap-4 py-8">
                    <div className="shrink-0 w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center">
                        <ShieldX size={32} className="text-danger-600" />
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-danger-700">Access Denied</p>
                        <p>This application deployment is not authorized. Please contact support.</p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
