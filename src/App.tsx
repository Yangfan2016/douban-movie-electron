import React, { useRef } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import "antd/dist/antd.css";
import "./App.css";
import RouterView from './router/RouterView';
import TopNav from './components/TopNav';

moment.locale('zh-cn');

const menuList = [
  ["#hash-top", "推荐"],
  ["#hash-hotshow", "正在热映"],
  ["#hash-newmovie", "新片榜"],
  ["#hash-weekly", "口碑榜"],
  ["#hash-top250", "Top 250"]
];

function App() {
  let refMainBox: React.MutableRefObject<any> = useRef();

  function routerBeforeEnterHook(path: string) {
    if (path !== '/home') {
      let el = refMainBox.current;
      // 滚动条复位，回到原点
      el && el.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      // 取消所有请求
      window.cancalXHRList.forEach((source: CancelTokenSource) => {
        source.cancel("cancel xhr");
      });
    }
  }

  function scrollToAchorView(selector: string) {
    const parent = refMainBox.current;
    if (parent === void 0) return;
    const target = parent.querySelector(selector);
    target && target.scrollIntoView();
  }

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
                      <Link to='/home' onClick={() => scrollToAchorView(item[0])}>
                        <h3 className="title">{item[1]}</h3>
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className="win-main">
            <div className="mian-box" ref={refMainBox}>
              <RouterView beforeEnter={routerBeforeEnterHook} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    </LocaleProvider>
  );
}

export default App;
