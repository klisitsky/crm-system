import { Navigate, useSearchParams } from "react-router";
import { useAppSelector } from "../../app/redux";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { SignUpForm } from "../../components/SignUpForm/SignUpForm";
import { authSlice } from "./AuthSlice";

export const AuthPage = () => {
  const [params] = useSearchParams();
  const isLogin = params.get("mode") === "login";

  const accessToken = useAppSelector(authSlice.selectors.selectAccessToken);
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return isLogin ? <LoginForm /> : <SignUpForm />;
};
