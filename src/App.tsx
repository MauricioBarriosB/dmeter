import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@components/Layout";
import { AuthProvider } from "@modules/user/context/AuthContext";
import ProtectedRoute from "@/modules/user/components/ProtectedRoute";

const Home = lazy(() => import("@modules/home/pages/Home"));
const Contact = lazy(() => import("@modules/contact/pages/Contact"));
const Login = lazy(() => import("@modules/user/pages/Login"));
const Register = lazy(() => import("@modules/user/pages/Register"));
const UserData = lazy(() => import("@modules/user/pages/UserData"));
const UserAccount = lazy(() => import("@modules/user/pages/UserAccount"));

const Meter = lazy(() => import("@modules/meter/pages/Meter"));
const DetailMeter = lazy(() => import("@modules/meter/pages/DetailMeter"));

const Acoustics = lazy(() => import("@modules/acoustics/pages/Acoustics"));
const DetailAcoustics = lazy(() => import("@modules/acoustics/pages/DetailAcoustics"));

const Materials = lazy(() => import("@modules/materials/pages/Materials"));
const DetailMaterials = lazy(() => import("@modules/materials/pages/DetailMaterials"));

const Instruments = lazy(() => import("@modules/instruments/pages/Instruments"));
const DetailInstruments = lazy(() => import("@modules/instruments/pages/DetailInstruments"));

const Time = lazy(() => import("@modules/time/pages/Time"));
const DetailTime = lazy(() => import("@modules/time/pages/DetailTime"));

const Audio = lazy(() => import("@modules/audio/pages/Audio"));
const DetailAudio = lazy(() => import("@modules/audio/pages/DetailAudio"));

function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-default-500">Loading...</p>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter basename="/dmeter">
            <AuthProvider>
                <Layout>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected user routes */}
                            <Route
                                path="/userdata"
                                element={
                                    <ProtectedRoute>
                                        <UserData />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/useraccount"
                                element={
                                    <ProtectedRoute>
                                        <UserAccount />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected feature routes */}
                            <Route
                                path="/meter"
                                element={
                                    <ProtectedRoute>
                                        <Meter />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analysis/:id"
                                element={
                                    <ProtectedRoute>
                                        <DetailMeter />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/acoustics"
                                element={
                                    <ProtectedRoute>
                                        <Acoustics />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/acoustics/:id"
                                element={
                                    <ProtectedRoute>
                                        <DetailAcoustics />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/materials"
                                element={
                                    <ProtectedRoute>
                                        <Materials />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/materials/:id"
                                element={
                                    <ProtectedRoute>
                                        <DetailMaterials />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/instruments"
                                element={
                                    <ProtectedRoute>
                                        <Instruments />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/instruments/:id"
                                element={
                                    <ProtectedRoute>
                                        <DetailInstruments />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/time"
                                element={
                                    <ProtectedRoute>
                                        <Time />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/time/:id"
                                element={
                                    <ProtectedRoute>
                                        <DetailTime />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/audio"
                                element={
                                    <ProtectedRoute>
                                        <Audio />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/audio/:id"
                                element={
                                    <ProtectedRoute>
                                        <DetailAudio />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Suspense>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
