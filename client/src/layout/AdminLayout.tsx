import { Outlet, useLocation } from "react-router-dom";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import AdminNavbar from "@/components/navbar/AdminNavbar";
// import UserFooter from "@/components/footer/UserFooter";

function UserLayout() {
  const { pathname } = useLocation();

  const routeWithoutNav = [
    AdminUrls.signIn,

  ];

  // const routeWithoutFooter = [UserUrls.signIn];

  const hideNavbar = routeWithoutNav.some((route) =>
    pathname.startsWith(route),
  );
  // const hideFooter = routeWithoutFooter.some((route) =>
  //   pathname.startsWith(route)
  // );

  return (
    <>
      {!hideNavbar && <AdminNavbar />}
      <div className={hideNavbar ? "" : "pt-16"}>
        <Outlet />
      </div>
      {/* {!hideFooter && <UserFooter />} */}
    </>
  );
}

export default UserLayout;
