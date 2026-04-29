
import { useQuery } from "@tanstack/react-query";

import { getAllImageByBook } from "../api/imageApi";

export function useImagesByBook(idBook?: number) {
  return useQuery({
    queryKey: ["images", "byBook", idBook],
    queryFn: () => getAllImageByBook(idBook as number),
    enabled: typeof idBook === "number",
  });
}
