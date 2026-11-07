import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import ReusableNavbar, { NavLinkItem } from "./ReusableNavbar";
import { useAuthUser } from "./useAuthUser";

const adminLinks: NavLinkItem[] = [
  { name: "Dashboard", url: AdminUrls.home, end: true },
  { name: "Users", url: AdminUrls.users },
  { name: "Categories", url: AdminUrls.categories },
  { name: "Products", url: AdminUrls.products },
  { name: "Orders", url: AdminUrls.orders },
];

function AdminNavbar() {
  const { user, logout } = useAuthUser();

  return (
    <ReusableNavbar
      brand="ShopHub"
      badge="Admin"
      homeUrl={AdminUrls.home}
      authUrl={AdminUrls.signIn}
      profileUrl={AdminUrls.profile}
      links={adminLinks}
      user={user}
      onLogout={logout}
    />
  );
}

export default AdminNavbar;
