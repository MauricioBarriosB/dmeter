import { Card, CardBody } from "@heroui/react";

interface LoadErrorCardProps {
    message: string;
    maxWidth?: "4xl" | "7xl";
    cardClassName?: string;
}

export default function LoadErrorCard({ message, maxWidth = "4xl", cardClassName }: Readonly<LoadErrorCardProps>) {
    const content = (
        <Card className={cardClassName}>
            <CardBody>
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 text-center">
                    <p className="text-danger">{message}</p>
                </div>
            </CardBody>
        </Card>
    );

    if (!maxWidth) {
        return content;
    }

    return (
        <div className={`max-w-${maxWidth} mx-auto`}>
            {content}
        </div>
    );
}
