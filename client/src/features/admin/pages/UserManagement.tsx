import { useCallback, useEffect, useState } from "react";
import {
  useFetchUsersMutation,
  useUpdateUserBlockMutation,
} from "@/services/apis/AdminApis";
import type { IUserDB } from "@/@types/interface/IDataBase";
import Pagination from "@/components/common/Pagination";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastProvider/toast";

interface UsersResponse {
  users: IUserDB[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

function UserManagement() {
  const [page, setPage] = useState(1);
  const [fetchUsers, { data, isLoading }] = useFetchUsersMutation();
  const [updateUserBlock, { isLoading: isUpdating }] = useUpdateUserBlockMutation();
  const response = data as UsersResponse | undefined;

  const loadUsers = useCallback(async (requestedPage: number) => {
    try {
      await fetchUsers({ page: requestedPage, limit: 5 }).unwrap();
    } catch (error) {
      showErrorToast({
        title: "Unable to load users",
        description: getErrorMessage(error),
      });
    }
  }, [fetchUsers]);

  useEffect(() => {
    void loadUsers(page);
  }, [loadUsers, page]);

  const handleBlockToggle = async (user: IUserDB) => {
    try {
      await updateUserBlock({
        userId: user.id,
        isBlocked: !user.isBlocked,
      }).unwrap();
      showSuccessToast({
        title: user.isBlocked ? "User unblocked" : "User blocked",
        description: `${user.name} was updated successfully.`,
      });
      await loadUsers(page);
    } catch (error) {
      showErrorToast({
        title: "Unable to update user",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">User management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage customer access and account status.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">Loading users...</p>
          ) : response?.users.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Name", "Email", "Joined", "Status", "Action"].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {response.users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => void handleBlockToggle(user)}
                            className={`rounded-md px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={response.pagination.page}
                totalPages={response.pagination.totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <p className="px-6 py-12 text-center text-sm text-gray-500">
              No users found.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default UserManagement;