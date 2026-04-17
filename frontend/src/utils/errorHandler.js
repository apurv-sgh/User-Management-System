export const getErrorMessage = (err) => {
  const data = err?.response?.data;

  return (
    data?.error?.message ||
    data?.message ||
    data?.error ||
    err.message ||
    "Something went wrong"
  );
};