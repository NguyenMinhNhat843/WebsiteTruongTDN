import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import viVN from 'antd/locale/vi_VN'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontFamily: `'Inter', sans-serif`,
          },
          components: {
            App: {},
          },
        }}
      >
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
