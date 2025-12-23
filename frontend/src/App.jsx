import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Add more protected routes here */}
      </Route>

      {/* Auth Routes (No Layout) */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
