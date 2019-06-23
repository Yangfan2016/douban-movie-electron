import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routerMap from "./config";


function CustomRoute(props: iRouterViewProps) {
  let path: string = props.location.pathname;

  props.beforeEnter && props.beforeEnter(path);

  // '/'-> '/home
  if (path === '/') return <Redirect to='/home' />

  // if can match
  let matchRoute: any = routerMap.find(item => {
    let url = item.path;
    // /detail/:id -> \\/detail\\/[^/+]
    url = url.replace(/(\:.+)/g, "[^/]+").replace(/\//g, "\\/");

    return new RegExp(`${url}(\\/|\\/)?$`, 'gi').test(path);
  });

  if (matchRoute) {
    return <Route exact={!matchRoute.hasChild} path={matchRoute.path} component={matchRoute.component} />
  }
  return <Redirect to='/home' />
}

export default function (props: iRouterViewProps) {
  return (
    <Switch>
      <CustomRoute {...props} />
    </Switch>
  );
}


