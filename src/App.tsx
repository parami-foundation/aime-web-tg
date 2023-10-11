import { matchRoutes } from "umi";
import { PROJECT_CONFIG } from "./constants/global";

export function onRouteChange({ clientRoutes, location }: any) {
  const route: any = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title
      ? `${route.title} | ${PROJECT_CONFIG.name}`
      : PROJECT_CONFIG.name;
  }
}