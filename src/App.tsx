import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import {
  Home,
  Contact,
  Login,
  UserData,
  Meter,
  Statistics,
  UserAccount,
} from "./pages";

function App() {
  return (
    <BrowserRouter basename="/dmeter">
      <Layout>
        <Routes> 
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userdata" element={<UserData />} />
          <Route path="/" element={<Meter />} />
          <Route path="/meter" element={<Meter />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/useraccount" element={<UserAccount />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
