// get error object with message
export const getNullErrorData = (errorMessage: string) => {
  return {
    success: false,
    message: errorMessage,
    data: null,
  };
};
