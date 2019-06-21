import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import "antd/dist/antd.css";
import "./App.css";
import RouterView from './router/RouterView';
import TopNav from './components/TopNav';

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

const menuList = [
  ["/home#hash-top", "推荐"],
  ["/home#hash-hotshow", "正在热映"],
  ["/home#hash-newmovie", "新片榜"],
  ["/home#hash-weekly", "口碑榜"],
  ["/home#hash-top250", "Top 250"]
];

function App() {
  return (
    <LocaleProvider locale={zhCN}>
      <div className="App">
        <BrowserRouter>
          <div className="header">
            <TopNav />
          </div>
          <div className="win-side">
            <ul className="menu-list">
              {
                menuList.map((item: string[], index: number) => {
                  return (
                    <li className="list-item" key={index}>
                      <a href={item[0]}>
                        <h3 className="title">{item[1]}</h3>
                      </a>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className="win-main">
            <div className="mian-box">
              <RouterView beforeEnter={routerBeforeEnterHook} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    </LocaleProvider>
  );
}

export default App;
