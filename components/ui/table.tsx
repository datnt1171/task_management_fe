import React from "react"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table ref={ref} className={`w-full caption-bottom text-sm ${className}`} {...props} />
      </div>
    )
  },
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => {
    return <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
  },
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => {
    return <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
  },
)
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", ...props }, ref) => {
    return <tr ref={ref} className={`border-b transition-colors hover:bg-gray-50 ${className}`} {...props} />
  },
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <th ref={ref} className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${className}`} {...props} />
    )
  },
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => {
    return <td ref={ref} className={`p-4 align-middle ${className}`} {...props} />
  },
)
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
