// src/hooks/useBlogSearch.ts
import { useQuery } from "@tanstack/react-query";
import { searchBlogsByTitle } from "@/actions/blogActions";

export function useBlogSearch(searchTerm: string) {
  return useQuery({
    queryKey: ["blogs", "search", searchTerm],
    queryFn: () => searchBlogsByTitle(searchTerm),
    enabled: !!searchTerm.trim(), // only run if searchTerm is not empty
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
  });
}
