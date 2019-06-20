import React from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import "antd/dist/antd.css";
import "./App.css";
import RouterView from './router/RouterView';

moment.locale('zh-cn');

function routerBeforeEnterHook(path: string) {
  // 滚动条复位，回到原点
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  // 取消所有请求
  window.cancalXHRList.forEach((source: CancelTokenSource) => {
    source.cancel("cancel xhr");
  });
}

function App() {
  return (
    <LocaleProvider locale={zhCN}>
      <div className="App">
        <BrowserRouter>
          <div className="win-side" style={
            { margin: "100px 0" }
          }>
            {/* nav */}
            <Link to="/">主页</Link>
          </div>
          <div className="win-main">
            <RouterView beforeEnter={routerBeforeEnterHook} />
          </div>
        </BrowserRouter>
      </div>
    </LocaleProvider>
  );
}

export default App;
