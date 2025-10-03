import { Button, Result } from "antd";
import { useNavigate } from "react-router";

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const handleGoToHomePage = () => {
    navigate("/");
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Извините, у вас не достаточно прав."
      extra={
        <Button type="primary" onClick={handleGoToHomePage}>
          Вернуться на главную
        </Button>
      }
    />
  );
};
