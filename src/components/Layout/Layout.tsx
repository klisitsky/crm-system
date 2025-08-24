import Sider from "antd/es/layout/Sider";
import Layout, { Content } from "antd/es/layout/layout";
import { AppMenu } from "../AppMenu/AppMenu";
import type { FC, ReactNode } from "react";

interface AppLayout {
  children: ReactNode;
}

export const AppLayout: FC<AppLayout> = ({ children }) => {

  return (
    <Layout>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0" style={{ minHeight: "100vh" }}>
        <AppMenu />
      </Sider>
      <Layout>
        <Content style={{ margin: "25px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};
