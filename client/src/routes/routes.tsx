import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
// import AdminProtected from "./protected/AdminProtected";
// import UserProtected from "./protected/UserProtected";
import UserLayout from "../layout/UserLayout";
import AdminProtected from "./protected/AdminProtected";
import ErrorPage404 from "../components/error/ErrorPage404";
import ErrorPage500 from "../components/error/ErrorPage500";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import RedirectSignInUser from "./protected/RedirectSignInUser";
import UserProtected from "./protected/UserProtected";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";

////////////////////////--User side--/////////////////////

const Authpages = lazy(() => import("@/features/auth/pages/Authpages"));

////////////////////////--User side--/////////////////////

////////////////////////--Admin side--///////////////////////

const UserManagement = lazy(
  () => import("@/features/admin/pages/UserManagement"),
);
const CategoryManagement = lazy(
  () => import("@/features/admin/pages/CategoryManagement"),
);
const Profile = lazy(() => import("@/features/common/pages/Profile"));

////////////////////////--Admin side--/////////////////////

const routes = createBrowserRouter(
  [
    ////////////////--User--/////////////////////
    {
      path: UserUrls.home,
      element: <UserLayout />,
      children: [
        // ------------------User--------------
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
          path: UserUrls.profile,
          element: (
            <UserProtected>
              <Suspense fallback={<div>Loading....</div>}>
                <Profile />
              </Suspense>
            </UserProtected>
          ),
        },
        // ------------------User End-----------
        // ------------------Admin--------------
        {
          path: AdminUrls.profile,
          element: (
            <AdminProtected>
              <Suspense fallback={<div>Loading....</div>}>
                <Profile />
              </Suspense>
            </AdminProtected>
          ),
        },
        {
          path: AdminUrls.categories,
          element: (
            <AdminProtected>
              <Suspense fallback={<div>Loading....</div>}>
                <CategoryManagement />
              </Suspense>
            </AdminProtected>
          ),
        },
        {
          path: AdminUrls.userManagement,
          element: (
            <AdminProtected>
              <UserManagement />
            </AdminProtected>
          ),
        },
        // ------------------Admin End-----------
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
