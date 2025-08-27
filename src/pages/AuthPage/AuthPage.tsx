import { Card, Flex } from "antd";
import { Navigate, useSearchParams } from "react-router";
import { authSlice } from "./AuthSlice";
import { useAppSelector } from "@/app/redux";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { SignUpForm } from "@/components/SignUpForm/SignUpForm";

export const AuthPage = () => {
  const [params] = useSearchParams();
  const isLogin = params.get("mode") === "login";

  const accessToken = useAppSelector(authSlice.selectors.selectAccessToken);
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <Flex justify="center" align="center" style={{height: "100vh"}}>
      <Card style={{minWidth: "400px"}}>{isLogin ? <LoginForm /> : <SignUpForm />}</Card>
    </Flex>
  );  
};
