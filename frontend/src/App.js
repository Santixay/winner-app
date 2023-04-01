import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
// import Dashboard from "scenes/dashboard";
// import Products from "scenes/products";
import Customers from "scenes/customers";
import Packages from "scenes/packages";
import Users from "scenes/users";
import Scan from "scenes/scan";
import WhatsApp from "scenes/whatsapp";
import ShippingFee from "scenes/shippingfee";
import Tracking from "scenes/tracking";
import Delivered from "scenes/delivered";
import Login from "scenes/public/login";
import PublicTracking from "scenes/public/tracking";
import Roles from "scenes/role";
// import Transactions from "scenes/transactions";
// import Geography from "scenes/geography";
// import Overview from "scenes/overview";
// import Daily from "scenes/daily";
// import Monthly from "scenes/monthly";
// import Breakdown from "scenes/breakdown";
// import Admin from "scenes/admin";
// import Performance from "scenes/performance";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // console.log("Frontend is runing");


  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" replace />} />             */}
            <Route path="/" element={<PublicTracking />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              {/* <Route path="/" element={<Navigate to="/longin" replace />} /> */}
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/packages" element={<Packages />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/users" element={<Users />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/whatsapp" element={<WhatsApp />} />
              <Route path="/shippingfee" element={<ShippingFee />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/delivered" element={<Delivered />} />
              <Route path="/roles" element={<Roles />} />

              {/* <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} /> */}
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
