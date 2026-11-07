import { UserUrls } from "@/@types/urlEnums/UserUrls";
import ReusableNavbar, { NavLinkItem } from "./ReusableNavbar";
import { useAuthUser } from "./useAuthUser";

const customerLinks: NavLinkItem[] = [
  { name: "Home", url: UserUrls.home, end: true },
  { name: "Products", url: UserUrls.products },
  { name: "My Orders", url: UserUrls.orders },
];

function UserNavbar() {
  const { user, logout } = useAuthUser();

  return (
    <ReusableNavbar
      brand="ShopHub"
      homeUrl={UserUrls.home}
      authUrl={UserUrls.authenticate}
      profileUrl={UserUrls.profile}
      links={customerLinks}
      user={user}
      onLogout={logout}
    />
  );
}

export default UserNavbar;