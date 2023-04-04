import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// import { createTheme } from "@mui/material/styles";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
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
import { logout } from "utils";
import AuthVerify from "utils/AuthVerify";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // console.log("Frontend is runing");

  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" replace />} />             */}
            {localStorage.getItem("token") ? (
              <>
                <Route element={<Layout />}>
                  {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                  <Route path="*" element={<Scan />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/scan" element={<Scan />} />
                  <Route path="/whatsapp" element={<WhatsApp />} />
                  <Route path="/shippingfee" element={<ShippingFee />} />
                  <Route path="/tracking" element={<Tracking />} />
                  <Route path="/delivered" element={<Delivered />} />
                  <Route path="/roles" element={<Roles />} />
                </Route>
              </>
            ) : (
              <>
                <Route path="*" element={<PublicTracking />} />
                <Route path="/login" element={<Login />} />
              </>
            )}
          </Routes>
          <AuthVerify logOut={logOut} />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
