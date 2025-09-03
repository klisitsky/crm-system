import { Card, Flex } from "antd";
import { Navigate, useLocation, useSearchParams } from "react-router";
import { authSlice } from "./AuthSlice";
import { useAppSelector } from "@/app/redux";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { SignUpForm } from "@/components/SignUpForm/SignUpForm";
import { getPathFrom } from "@/utils/getPathFrom";

export const AuthPage = () => {
  const [params] = useSearchParams();
  const isLogin = (params.get("mode") ?? "login") === "login";
  const location = useLocation();

  const isAuthorization = useAppSelector(authSlice.selectors.selectIsAuthorization);
  if (isAuthorization) {
    return <Navigate to={getPathFrom(location)} replace />;
  }

  return (
    <Flex justify="center" align="center" style={{height: "100vh"}}>
      <Card style={{minWidth: "400px"}}>{isLogin ? <LoginForm /> : <SignUpForm />}</Card>
    </Flex>
  );  
};
