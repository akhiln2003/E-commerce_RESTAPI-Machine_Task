import { Link } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { useGetUser } from "@/hooks/useGetUser";

function Home() {
  const user = useGetUser();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 text-white shadow-xl sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
              Welcome to ShopHub
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-300">
              Discover quality products, find what you need quickly, and keep
              track of every order from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={UserUrls.products}
                className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Browse products
              </Link>
              <Link
                to={UserUrls.orders}
                className="rounded-md border border-gray-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-gray-400 hover:bg-gray-800"
              >
                View my orders
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            to={UserUrls.products}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-semibold text-gray-900">Explore products</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Search, filter, sort, and browse products across every category.
            </p>
          </Link>
          <Link
            to={UserUrls.orders}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-semibold text-gray-900">Track your orders</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review your order history, items, totals, and current status.
            </p>
          </Link>
          <Link
            to={UserUrls.profile}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-semibold text-gray-900">Manage your profile</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              View your account details and membership information.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Home;
