import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const UserData = lazy(() => import("./pages/UserData"));
const Meter = lazy(() => import("./pages/Meter"));
const Statistics = lazy(() => import("./pages/Statistics"));
const UserAccount = lazy(() => import("./pages/UserAccount"));
const DetailAnalysis = lazy(() => import("./pages/DetailAnalysis"));
const DetailMetrics = lazy(() => import("./pages/DetailMetrics"));
const Acoustics = lazy(() => import("./pages/Acoustics"));
const DetailAcoustics = lazy(() => import("./pages/DetailAcoustics"));
const Materials = lazy(() => import("./pages/Materials"));
const DetailMaterials = lazy(() => import("./pages/DetailMaterials"));
const Instruments = lazy(() => import("./pages/Instruments"));
const DetailInstruments = lazy(() => import("./pages/DetailInstruments"));

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
            <Layout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/userdata" element={<UserData />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/meter" element={<Meter />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/useraccount" element={<UserAccount />} />
                        <Route path="/analysis/:id" element={<DetailAnalysis />} />
                        <Route path="/metrics/:id" element={<DetailMetrics />} />
                        <Route path="/acoustics" element={<Acoustics />} />
                        <Route path="/acoustics/:id" element={<DetailAcoustics />} />
                        <Route path="/materials" element={<Materials />} />
                        <Route path="/materials/:id" element={<DetailMaterials />} />
                        <Route path="/instruments" element={<Instruments />} />
                        <Route path="/instruments/:id" element={<DetailInstruments />} />
                    </Routes>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
