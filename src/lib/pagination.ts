export const PAGE_SIZE = 20

export const totalPages = (itemCount: number, pageSize = PAGE_SIZE): number =>
  Math.ceil(itemCount / pageSize)

export const paginate = <T>(
  items: T[],
  page: number,
  pageSize = PAGE_SIZE
): T[] => {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
