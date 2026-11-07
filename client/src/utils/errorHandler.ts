export const getErrorMessage = (error: unknown): string => {
  if (typeof error !== "object" || error === null) {
    return "Something went wrong. Please try again.";
  }

  const err = error as Record<string, unknown>;

  const data = err.data as Record<string, unknown> | undefined;

  const response = err.response as Record<string, unknown> | undefined;
  const axiosData = response?.data as Record<string, unknown> | undefined;

  const errorData = data || axiosData;

  if (errorData) {
    const errors = errorData.errors;

    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = errors[0] as Record<string, unknown>;

      if (typeof firstError.message === "string") {
        return firstError.message;
      }
    }

    if (typeof errorData.message === "string") {
      return errorData.message;
    }
  }

  if (typeof err.message === "string") {
    return err.message;
  }

  return "Something went wrong. Please try again.";
};