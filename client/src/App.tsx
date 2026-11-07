import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand={false}
        visibleToasts={3}
      />
      <RouterProvider router={routes} />;
    </>
  );
}

export default App;
