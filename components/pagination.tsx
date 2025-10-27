"use client"

export default function Pagination({
  itemsPerPage,
  totalItems,
  lastItem,
  setcurrentPage,
  currentPage,
}: {
  itemsPerPage: number
  totalItems: number
  lastItem: number
  setcurrentPage: (page: number) => void
  currentPage: number
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(lastItem, totalItems)

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setcurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm text-white bg-sky-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-500"
        >
          Previous
        </button>
        <button
          onClick={() => setcurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm text-white bg-sky-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-500"
        >
          Next
        </button>
      </div>
    </div>
  )
}
