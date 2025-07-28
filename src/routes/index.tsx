import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  route("/", "./App.tsx"),
  route("/redirect", "./Redirect.tsx"),

  ...(await flatRoutes()),
] satisfies RouteConfig;
