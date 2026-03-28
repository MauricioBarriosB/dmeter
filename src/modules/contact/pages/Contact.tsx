import { Mail, Globe, Headphones, MessageCircle, Mic, Waves, Music4 } from "lucide-react";
import { Card, CardBody, Button, Divider } from "@heroui/react";

export default function Contact() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <Mail size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Contact & Support
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Have questions about DMeter or need help with audio analysis? We'd love to hear from you.
                </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Email Card */}
                <Card className="border border-default-200">
                    <CardBody className="p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail size={32} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Email Us</h2>
                        <p className="text-default-500">
                            Send us your questions, feedback, or support requests. We typically respond within 24 hours.
                        </p>
                        <Button
                            as="a"
                            href="mailto:mbarrios@capacitaenlinea.cl"
                            color="primary"
                            variant="shadow"
                            size="lg"
                            className="font-semibold mt-2"
                            startContent={<MessageCircle size={20} />}
                        >
                            mbarrios@capacitaenlinea.cl
                        </Button>
                    </CardBody>
                </Card>

                {/* Website Card */}
                <Card className="border border-default-200">
                    <CardBody className="p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Globe size={32} className="text-secondary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Visit Our Website</h2>
                        <p className="text-default-500">
                            Explore our full catalog of professional training courses, certifications, and educational
                            resources.
                        </p>
                        <Button
                            as="a"
                            href="https://capacitaenlinea.cl/"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="secondary"
                            variant="shadow"
                            size="lg"
                            className="font-semibold mt-2"
                            startContent={<Globe size={20} />}
                        >
                            capacitaenlinea.cl
                        </Button>
                    </CardBody>
                </Card>
            </div>

            <Divider className="my-8" />

            {/* What We Can Help With */}
            <div className="mb-10">
                <h2
                    className="text-3xl font-bold text-foreground mb-6 text-center"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    How Can We Help You?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Card className="border border-default-100">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-default/10 flex items-center justify-center">
                                <Music4 size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold">Audio File Analysis</h3>
                            <p className="text-sm text-default-500">
                                Questions about FFT spectrum, LUFS loudness, stereo correlation, or mastering
                                recommendations for your tracks.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-100">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mic size={24} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-bold">Real-Time Metering</h3>
                            <p className="text-sm text-default-500">
                                Help with microphone input analysis, dB monitoring, spectrum visualization, or
                                calibration questions.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-100">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                <Waves size={24} className="text-secondary" />
                            </div>
                            <h3 className="text-lg font-bold">Room Acoustics</h3>
                            <p className="text-sm text-default-500">
                                Assistance with RT60 calculations, speech intelligibility metrics, material selection,
                                or acoustic treatment planning.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-100">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                                <Headphones size={24} className="text-warning" />
                            </div>
                            <h3 className="text-lg font-bold">Technical Support</h3>
                            <p className="text-sm text-default-500">
                                Report bugs, request features, or get help with account and platform-related issues.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-100">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                                <MessageCircle size={24} className="text-success" />
                            </div>
                            <h3 className="text-lg font-bold">Feedback & Suggestions</h3>
                            <p className="text-sm text-default-500">
                                Share your ideas to help us improve DMeter. We value input from audio professionals and
                                enthusiasts alike.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-100">
                        <CardBody className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                                <Globe size={24} className="text-danger" />
                            </div>
                            <h3 className="text-lg font-bold">Training & Courses</h3>
                            <p className="text-sm text-default-500">
                                Explore professional audio engineering courses and certifications at capacitaenlinea.cl.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
