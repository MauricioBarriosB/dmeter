import { Card, CardBody, Spinner } from "@heroui/react";

interface LoadingCardProps {
    message?: string;
    maxWidth?: "7xl" | "6xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm";
    cardClassName?: string;
}

const maxWidthClasses: Record<string, string> = {
    "7xl": "max-w-7xl",
    "6xl": "max-w-6xl",
    "5xl": "max-w-5xl",
    "4xl": "max-w-4xl",
    "3xl": "max-w-3xl",
    "2xl": "max-w-2xl",
    xl: "max-w-xl",
    lg: "max-w-lg",
    md: "max-w-md",
    sm: "max-w-sm",
};

export default function LoadingCard({ message = "Loading form data...", maxWidth, cardClassName }: LoadingCardProps) {
    const card = (
        <Card className={cardClassName}>
            <CardBody className="flex items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="ml-3 text-default-600">{message}</p>
            </CardBody>
        </Card>
    );

    if (maxWidth) {
        return <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>{card}</div>;
    }

    return card;
}
