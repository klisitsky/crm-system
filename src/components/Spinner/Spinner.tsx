import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import Flex from "antd/es/flex";
import Spin from "antd/es/spin";

export const Spinner = () => {
  return (
    <Flex justify="center">
      <Spin size="large" indicator={<LoadingOutlined spin />} />
    </Flex>
  );
};
