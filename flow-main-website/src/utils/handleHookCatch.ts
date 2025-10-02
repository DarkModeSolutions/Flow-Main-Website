const handleHookCatch = (
  error: unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  defaultMessage: string
) => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  setError(errorMessage);
  console.error(defaultMessage, error);
};

export default handleHookCatch;
