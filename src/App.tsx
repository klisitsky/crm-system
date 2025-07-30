import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router";
import "./App.css";
import { AppMenu } from "./components/AppMenu/AppMenu";

function App() {
  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
        style={{ position: "fixed", height: "100%" }}
      >
        <AppMenu />
      </Sider>
      <Layout>
        <Content style={{ margin: "25px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;