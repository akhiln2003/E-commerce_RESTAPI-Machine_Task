import { useFetchUserProfileQuery } from "@/services/apis/UserApis";
import type { IUserDB } from "@/@types/interface/IDataBase";

function Profile() {
  const { data, isLoading, isError, refetch } =
    useFetchUserProfileQuery();
  const user: IUserDB | undefined = data?.user;
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-sm text-red-600">
            We could not load your profile. Please try again.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {isAdmin ? "Administration" : "Account"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Your profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            View your account information and access level.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span
              className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                isAdmin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isAdmin ? "Administrator" : "Customer"}
            </span>
          </div>

          <dl className="grid gap-6 px-6 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Account type
              </dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}

export default Profile;
