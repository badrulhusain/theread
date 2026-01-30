import { db } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  rank: number;
}

export async function searchBlogs(
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const results = await db.$queryRawUnsafe<SearchResult[]>(
    `
    SELECT 
      id, 
      title, 
      content, 
      "authorId", 
      "createdAt",
      ts_rank_cd(search_vector, websearch_to_tsquery('english', $1)) AS rank
    FROM blogs
    WHERE search_vector @@ websearch_to_tsquery('english', $1)
    AND status = 'published'
    ORDER BY rank DESC
    LIMIT $2 OFFSET $3
    `,
    query,
    limit,
    offset
  );

  return results;
}
