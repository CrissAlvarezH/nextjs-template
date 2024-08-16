import { useState } from "react";

type AsyncFunction = (...args: any) => Promise<any>;

export function useServerAction<T extends AsyncFunction>(
  action: T,
  listeners?: {
    onSuccess?: (data: Awaited<ReturnType<T> | undefined>) => void;
  },
) {
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Awaited<ReturnType<T>> | undefined>(
    undefined,
  );
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function execute(...payload: Parameters<T>) {
    setLoading(true);
    setError(undefined);
    setData(undefined);
    setSuccess(false);

    try {
      const res = await action(...payload);
      if (res && res.error) setError(res.error);
      else {
        setData(res);
        setSuccess(true);
        if (listeners?.onSuccess) listeners.onSuccess(data);
      }
    } catch (error: any) {
      console.log(error);
      setError("Ocurrió un inconveniente, vuelve a intentar mas tarde");
    }

    setLoading(false);
  }

  return { execute, loading, success, data, error };
}
