import React from 'react';
import { cn } from '../../utils/cn';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped = true, hoverable = true, compact = false, ...props }, ref) => {
    return (
      <div className="relative overflow-x-auto shadow-md border border-gray-200 rounded-lg bg-white transition-all duration-300 hover:shadow-lg">
        <table
          ref={ref}
          className={cn(
            'w-full text-sm text-left text-gray-700',
            'enhanced-table',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = 'Table';

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('text-xs uppercase bg-gray-100 text-gray-700', className)}
        {...props}
      />
    );
  }
);

TableHead.displayName = 'TableHead';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn('', className)} {...props} />;
  }
);

TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  striped?: boolean;
  hoverable?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, striped = true, hoverable = true, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          striped && 'even:bg-blue-50/30',
          hoverable && 'hover:bg-blue-50/50 transition-colors duration-300',
          'transform transition-transform hover:scale-[1.01]',
          className
        )}
        {...props}
      />
    );
  }
);

TableRow.displayName = 'TableRow';

interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-6 py-3 font-semibold text-xs tracking-wider uppercase',
          'bg-gradient-to-r from-gray-100 to-gray-50',
          'text-gray-700 border-b border-gray-200',
          className
        )}
        {...props}
      />
    );
  }
);

TableHeader.displayName = 'TableHeader';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  compact?: boolean;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, compact = false, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'px-6 py-4', 
          compact && 'px-4 py-2', 
          'transition-colors duration-200',
          'border-b border-gray-100',
          className
        )}
        {...props}
      />
    );
  }
);

TableCell.displayName = 'TableCell';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200', className)}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={cn(
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};