import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/index.scss'
import '@ant-design/v5-patch-for-react-19';
import { unstableSetRender } from 'antd';

createRoot(document.getElementById('root')!).render(
    <App />
)


unstableSetRender((node, container) => {
    container._reactRoot ||= createRoot(container);
    const root = container._reactRoot;
    root.render(node);
    return async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      root.unmount();
    };
  });