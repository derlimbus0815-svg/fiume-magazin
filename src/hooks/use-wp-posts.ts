import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getPosts, getPost, getCategories, searchPosts, type WPPost, type WPCategory } from "@/lib/wp-api";

const PER_PAGE = 20;

export function useWPPosts(page = 1, categoryId?: number) {
  return useQuery<WPPost[]>({
    queryKey: ["wp-posts", page, categoryId],
    queryFn: () => getPosts(page, PER_PAGE, categoryId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInfiniteWPPosts(categoryId?: number) {
  return useInfiniteQuery<WPPost[]>({
    queryKey: ["wp-posts-infinite", categoryId],
    queryFn: ({ pageParam }) => getPosts(pageParam as number, PER_PAGE, categoryId),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < PER_PAGE) return undefined;
      return (lastPageParam as number) + 1;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWPPost(slug: string) {
  return useQuery<WPPost>({
    queryKey: ["wp-post", slug],
    queryFn: () => getPost(slug),
    enabled: !!slug,
  });
}

export function useWPCategories() {
  return useQuery<WPCategory[]>({
    queryKey: ["wp-categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000,
  });
}

export function useWPSearch(query: string) {
  return useQuery<WPPost[]>({
    queryKey: ["wp-search", query],
    queryFn: () => searchPosts(query),
    enabled: query.length >= 2,
  });
}
