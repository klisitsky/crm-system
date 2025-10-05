import { Button, Result } from "antd";
import { useNavigate } from "react-router";

export const ErrorPage = () => {
  const navigate = useNavigate();
  const handleGoToHomePage = () => {
    navigate("/");
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, данной страницы не существует."
      extra={
        <Button type="primary" onClick={handleGoToHomePage}>
          Вернуться на главную
        </Button>
      }
    />
  );
};
