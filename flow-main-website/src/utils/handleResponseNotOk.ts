const handleResponseNotOk = async (response: Response, errorMsg: string) => {
  const errorText = await response.text();
  console.error(errorMsg, response.status, errorText);
  throw new Error(errorMsg);
};

export default handleResponseNotOk;
