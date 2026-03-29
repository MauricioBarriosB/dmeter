import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@heroui/react";

interface DetailPageNavProps {
    backLabel: string;
    backUrl: string;
    editUrl?: string;
    variant: "flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "ghost";
    className: string;
}

export default function DetailPageNav({
    backLabel,
    backUrl,
    editUrl,
    variant,
    className,
}: Readonly<DetailPageNavProps>) {
    const navigate = useNavigate();

    return (
        <div className={className}>
            <Button variant={variant} startContent={<ArrowLeft size={20} />} onPress={() => navigate(backUrl)}>
                {backLabel}
            </Button>
            {editUrl && (
                <Button variant={variant} startContent={<Pencil size={18} />} onPress={() => navigate(editUrl)}>
                    Edit Report
                </Button>
            )}
        </div>
    );
}
