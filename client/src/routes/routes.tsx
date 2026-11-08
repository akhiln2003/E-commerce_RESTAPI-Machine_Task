import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
// import AdminProtected from "./protected/AdminProtected";
// import UserProtected from "./protected/UserProtected";
import UserLayout from "../layout/UserLayout";
import ErrorPage404 from "../components/error/ErrorPage404";
import ErrorPage500 from "../components/error/ErrorPage500";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import RedirectSignInUser from "./protected/RedirectSignInUser";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";

////////////////////////--User side--/////////////////////

////////////////////////--User side--///////////////////////

////////////////////////--Admin side--/////////////////////

////////////////////////--Admin side--/////////////////////

////////////////////////--User side--///////////////////////

const Authpages = lazy(() => import("@/features/auth/pages/Authpages"));

////////////////////////--Admin side--/////////////////////

const routes = createBrowserRouter(
  [
    ////////////////--User--/////////////////////
    {
      path: UserUrls.home,
      element: <UserLayout />,
      children: [
        {
          path: UserUrls.authenticate,
          element: (
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading....</div>}>
                <Authpages />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
        {
          path: AdminUrls.userManagement,
          element: (
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading....</div>}>
                <Authpages />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
      ],
    },

    ////////////////--User end--///////////////////

    ///////////////--Common start--///////////////////

    { path: "/servererror", element: <ErrorPage500 /> },
    { path: "*", element: <ErrorPage404 /> },

    ////////////////--Common end--///////////////////
  ],
  {
    future: {
      // v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

export default routes;
