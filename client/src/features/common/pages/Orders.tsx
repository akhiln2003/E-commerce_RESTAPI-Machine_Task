import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import { useFetchOwnOrdersQuery } from "@/services/apis/UserApis";

function Orders() {
  const [page, setPage] = useState(1);
  const orderPageLimit = 5;
  const { data, isLoading, isFetching, isError, refetch } =
    useFetchOwnOrdersQuery(
      { page, limit: orderPageLimit },
      { refetchOnMountOrArgChange: true },
    );
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">My orders</h1>
        <div className="mt-6 space-y-4">
          {isLoading || isFetching ? <p className="text-sm text-gray-500">Loading orders...</p> : isError ? (
            <div className="text-center">
              <p className="text-sm text-red-600">Unable to load your orders.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : data?.orders.length ? data.orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-900">Order {order.id.slice(-8)}</span>
                <span className="text-sm capitalize text-gray-600">{order.status}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{order.items.length} product line(s)</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}`}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold text-gray-900">Total: {order.total}</p>
            </article>
          )) : <p className="text-sm text-gray-500">You have not placed any orders yet.</p>}
        </div>
        {data?.pagination && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;
