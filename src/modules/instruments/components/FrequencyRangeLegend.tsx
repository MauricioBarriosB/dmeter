import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

export default function FrequencyRangeLegend() {
    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-semibold">Frequency Range Legend</h2>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Frequency Bands</h3>
                        <p className="text-sm text-default-500 mb-2">Standard audio frequency classifications</p>
                        <div className="flex flex-wrap gap-2">
                            <Chip size="sm" color="danger" variant="flat">
                                Sub-bass: 20-60 Hz
                            </Chip>
                            <Chip size="sm" color="warning" variant="flat">
                                Bass: 60-250 Hz
                            </Chip>
                            <Chip size="sm" color="success" variant="flat">
                                Mids: 250 Hz-4 kHz
                            </Chip>
                            <Chip size="sm" color="primary" variant="flat">
                                Highs: 4-20 kHz
                            </Chip>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Frequency Range (High)</h3>
                        <p className="text-sm text-default-500 mb-2">
                            Indicates the upper frequency limit of each instrument
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Chip size="sm" color="success" variant="flat">
                                10+ kHz Wide range
                            </Chip>
                            <Chip size="sm" color="warning" variant="flat">
                                5-10 kHz Medium
                            </Chip>
                            <Chip size="sm" color="danger" variant="flat">
                                &lt;5 kHz Narrow
                            </Chip>
                            <Chip size="sm" color="default" variant="flat">
                                N/A Not applicable
                            </Chip>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
