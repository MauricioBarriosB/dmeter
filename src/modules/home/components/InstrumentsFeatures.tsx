import { Music, Waves, Database, Layers } from "lucide-react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function InstrumentsFeatures() {
    return (
        <>
            <p className="text-default-600 mb-4">
                Generate comprehensive instrument lists for musical ensembles, bands, and orchestras. Select your
                ensemble type, genre, and choose from a wide variety of instruments across 8 categories.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ensemble Types */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Music size={20} className="text-success" />
                            12 Ensemble Types
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "Symphony Orchestra",
                                "Big Band",
                                "Jazz Quartet",
                                "String Quartet",
                                "Rock Band",
                                "Choir",
                                "Chamber Orchestra",
                                "Wind Ensemble",
                                "Brass Band",
                                "Marching Band",
                                "Pop/Electronic",
                                "World Music Ensemble",
                            ].map((type) => (
                                <div
                                    key={type}
                                    className="p-2 rounded-lg bg-success/5 border border-success/10 text-sm"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Musical Genres */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Waves size={20} className="text-secondary" />
                            14 Musical Genres
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "Classical",
                                "Jazz",
                                "Rock",
                                "Pop",
                                "Blues",
                                "Country",
                                "Electronic",
                                "Folk",
                                "R&B/Soul",
                                "Metal",
                                "Reggae",
                                "Latin",
                                "Hip Hop",
                                "World Music",
                            ].map((genre) => (
                                <div
                                    key={genre}
                                    className="p-2 rounded-lg bg-secondary/5 border border-secondary/10 text-sm"
                                >
                                    {genre}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Instrument Categories */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Layers size={20} className="text-primary" />
                            100+ Instruments Across 8 Categories
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-danger/10 border border-danger/20">
                                <h4 className="font-medium text-danger mb-2">Rock & Metal (25)</h4>
                                <p className="text-sm text-default-600">
                                    Electric/Lead/Rhythm Guitars, Bass, Drum Kit components, Amplifiers, Pedals
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">Strings (11)</h4>
                                <p className="text-sm text-default-600">
                                    Violin, Viola, Cello, Double Bass, Acoustic/Classical Guitar, Harp, Banjo, Mandolin,
                                    Ukulele
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary mb-2">Woodwinds (7)</h4>
                                <p className="text-sm text-default-600">
                                    Flute, Clarinet, Oboe, Bassoon, Saxophone, Recorder, Piccolo
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-2">Brass (6)</h4>
                                <p className="text-sm text-default-600">
                                    Trumpet, Trombone, French Horn, Tuba, Cornet, Euphonium
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">Percussion (15)</h4>
                                <p className="text-sm text-default-600">
                                    Drum Kit, Timpani, Xylophone, Marimba, Vibraphone, Congas, Bongos, Cajon
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-default/10 border border-default/20">
                                <h4 className="font-medium text-default-700 mb-2">Keyboards (6)</h4>
                                <p className="text-sm text-default-600">
                                    Piano, Organ, Synthesizer, Electric Piano, Harpsichord, Accordion
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">Electronic (6)</h4>
                                <p className="text-sm text-default-600">
                                    Drum Machine, Sampler, DJ Mixer, Turntable, Effects Processor, MIDI Controller
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">Ethnic (28)</h4>
                                <p className="text-sm text-default-600">
                                    Sitar, Tabla, Erhu, Koto, Djembe, Kalimba, Didgeridoo, Oud, Bouzouki, Bagpipes
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Report Management */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Database size={20} className="text-warning" />
                            Report Management
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-2">Create & Edit</h4>
                                <p className="text-sm text-default-600">
                                    Generate new instrument reports or edit existing ones with full form validation.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">Persistent Storage</h4>
                                <p className="text-sm text-default-600">
                                    All reports automatically saved to Data Base for persistence across sessions.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">History & Review</h4>
                                <p className="text-sm text-default-600">
                                    View complete report history with ensemble type, genre, and selected instruments.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
