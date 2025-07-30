import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router";
import "./App.css";
import { AppMenu } from "./components/Menu/Menu";

function App() {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
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