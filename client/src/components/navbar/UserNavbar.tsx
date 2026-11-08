import { UserUrls } from "@/@types/urlEnums/UserUrls";
import ReusableNavbar, { NavLinkItem } from "./ReusableNavbar";
import { useAuthUser } from "./useAuthUser";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";

const customerLinks: NavLinkItem[] = [
  { name: "Home", url: UserUrls.home, end: true },
  { name: "Products", url: UserUrls.products },
  { name: "My Orders", url: UserUrls.orders },
];

const adminLinks: NavLinkItem[] = [
  // { name: "Dashboard", url: AdminUrls.dashboard, end: true },
  { name: "Products", url: AdminUrls.products },
  { name: "Orders", url: AdminUrls.orders },
  { name: "Users", url: AdminUrls.userManagement },
];

function UserNavbar() {
  const { user, logout } = useAuthUser();

  const isAdmin = user?.role === "admin";

  return (
    <ReusableNavbar
      brand="ShopHub"
      homeUrl={isAdmin ? AdminUrls.profile : UserUrls.home}
      authUrl={UserUrls.authenticate}
      profileUrl={isAdmin ? AdminUrls.profile : UserUrls.profile}
      links={isAdmin ? adminLinks : customerLinks}
      badge={isAdmin ? "Admin" : undefined}
      user={user}
      onLogout={logout}
    />
  );
}

export default UserNavbar;