import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = async (url: string, access: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.message = await res.json();
    throw error;
  }
  return res.json();
};

export const useCustomQuery = <T>(url: string | null) => {
  const { data: session } = useSession();
  const access = session?.user.access_token as string;
  return useSWR<T>(
    [url, access],
    ([url, access]: [url: string, access: string]) => fetcher(url, access),
    {
      dedupingInterval: 1000,
    }
  );
};
