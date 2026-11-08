import type { OrderStatus } from "@/@types/interface/IOrder";
import {
  useFetchOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/services/apis/AdminApis";
import { getErrorMessage } from "@/utils/errorHandler";
import { showErrorToast, showSuccessToast } from "@/components/ToastProvider/toast";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function OrderManagement() {
  const { data, isLoading } = useFetchOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const changeStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus({ orderId, status }).unwrap();
      showSuccessToast({ title: "Order status updated" });
    } catch (error) {
      showErrorToast({ title: "Unable to update order", description: getErrorMessage(error) });
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">Order management</h1>
        <section className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? <p className="p-8 text-sm text-gray-500">Loading orders...</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>{["Order", "Customer", "Total", "Status"].map((item) => <th key={item} className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">{item}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data?.orders.map((order) => <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium">{order.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.total}</td>
                  <td className="px-6 py-4">
                    <select value={order.status} onChange={(event) => void changeStatus(order.id, event.target.value as OrderStatus)} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm">
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>)}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

export default OrderManagement;
