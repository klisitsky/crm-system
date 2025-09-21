import { LoginForm } from "@/components/LoginForm/LoginForm";
import { SignUpForm } from "@/components/SignUpForm/SignUpForm";
import { selectAuthRequestData } from "@/store/selectors.ts/authSelectors";
import { getPathFrom } from "@/utils/getPathFrom";
import { Card, Flex } from "antd";
import { Navigate, useLocation, useSearchParams } from "react-router";
import { useAppSelector } from "../../store/redux";

export const AuthPage = () => {
  const [params] = useSearchParams();
  const isLogin = (params.get("mode") ?? "login") === "login";
  const location = useLocation();

  const { data } = useAppSelector(selectAuthRequestData);
  
  if (data?.isAuthorization) {
    return <Navigate to={getPathFrom(location)} replace />;
  }

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Card style={{ minWidth: "400px" }}>{isLogin ? <LoginForm /> : <SignUpForm />}</Card>
    </Flex>
  );
};
