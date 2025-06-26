import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/applicants", "routes/applicants.tsx"),
  route("/jobs", "routes/jobs.tsx"),
] satisfies RouteConfig;
