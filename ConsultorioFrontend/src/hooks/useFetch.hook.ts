import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";


import { handleApiError } from '../utils/constants/errors-handler.constants';
import { APIResponse } from '../utils/constants/api/api.constants';
import { getValidationError } from '../utils/get-validation-errors.utils';
import { checkSessionToken } from '../utils/constants/api/token';
import { getHeaderLogged } from '../utils/constants/api/headers.utils';

type FetchState<T> = {
  data: APIResponse<T> | null;
  error: { code: number; message: string } | null | Error;
  isLoading: boolean;
};

const useFetch = <T>(url: string | null) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const fetchData = useCallback(async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    if (!url) {
      // Si la URL es null o vacía, simplemente establece isLoading en false y retorna
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
      return;
    }

    const cancelToken = axios.CancelToken;
    const cancelTokenSource = cancelToken.source();
    cancelTokenSourceRef.current = cancelTokenSource;

    try {
      const response: AxiosResponse<APIResponse<T>> = await axios.get(url, {
        headers: {
          ...getHeaderLogged(),
        },
        cancelToken: cancelTokenSource.token,
      });

      // Actualizar los headers de axios
      response.headers = getHeaderLogged();
      // Sesión del token
     
      checkSessionToken(response);

      if (response?.data?.succeeded === false) {
        handleApiError(response?.data, true);
      }

      setState({
        data: response.data,
        error: null,
        isLoading: false,
      });
    } catch (err: unknown) {
      if (axios.isCancel(err) || !isMountedRef.current) {
        return;
      }

      const error: { code: number; message: string } = {
        code: (err as AxiosError)?.response?.status || 500,
        message: getValidationError((err as AxiosError).code as string),
      };

      setState({
        data: null,
        error: error,
        isLoading: false,
      });
    } finally {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current = null;
      }
    }
  }, [url]);

  const refresh = useCallback(() => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Request canceled");
    }
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Request canceled");
        cancelTokenSourceRef.current = null;
      }
    };
  }, [url, fetchData]);

  return { ...state, refresh };
};

export default useFetch;
