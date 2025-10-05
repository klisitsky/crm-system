import Sider from "antd/es/layout/Sider";
import Layout, { Content } from "antd/es/layout/layout";
import { AppMenu } from "@/components/AppMenu/AppMenu";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader/AppHeader";

export const AppLayout = () => {
  return (
    <Layout>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0" style={{ minHeight: "100vh" }}>
        <AppMenu />
      </Sider>
      <Layout>
        <AppHeader />
        <Content style={{ margin: "25px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
