import { AppMenu } from "@/components/AppMenu/AppMenu";
import Sider from "antd/es/layout/Sider";
import Layout, { Content } from "antd/es/layout/layout";
import type { FC, ReactNode } from "react";
import { AppHeader } from "../AppHeader/AppHeader";

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
        <AppHeader />
        <Content style={{ margin: "25px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};
