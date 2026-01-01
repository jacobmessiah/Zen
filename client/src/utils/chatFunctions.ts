import axios from "axios";
import i18next from "../../i18next";
import type { TenorApiResponse } from "../types";

const translate = i18next.getFixedT("chat");

export const searchTenor = async (queryKey: string) => {
  try {
    const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY;

    const locale = i18next.language;

    const params = new URLSearchParams({
      key: TENOR_API_KEY || "",
      q: queryKey,
      limit: "30",
      locale,
      media_filter: "gif,mediumgif,nanogif",
    });

    const url = `https://tenor.googleapis.com/v2/search?${params.toString()}`;

    const res = await axios.get(url);

    const resData: TenorApiResponse = res.data;
    return { results: resData.results, isError: false, errMessage: "" };
  } catch (error) {
    const message = translate("TenorSearchFailed");
    return { results: [], isError: false, errMessage: message };
  }
};
