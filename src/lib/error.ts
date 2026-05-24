export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (!error) {
    return fallback;
  }

  const apiError = error as { error?: { message?: string }; message?: string };

  if (apiError.error?.message) {
    return apiError.error.message;
  }

  if (apiError.message) {
    return apiError.message;
  }

  return fallback;
}
