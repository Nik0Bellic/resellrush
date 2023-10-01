import { useCallback, useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetMyCurrentBidsQuery } from '../slices/usersApiSlice';

const CurrentUserBidsTable = ({ setSelectedSum }) => {
  const {
    data: currentBids = [],
    isLoading,
    error,
  } = useGetMyCurrentBidsQuery();

  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.productImage, {
      id: 'image',
      cell: (info) => <img src={info.getValue()} alt='Bid Item' width='100' />,
      header: '',
    }),
    columnHelper.accessor(
      (row) => ({
        name: row.productName,
        color: row.productColor,
        size: row.size,
      }),
      {
        header: 'Item',
        cell: (info) => (
          <div>
            <div className='text-sm opacity-75'>{info.getValue()?.name}</div>
            <div className='font-semibold'>{info.getValue()?.color}</div>
            <div>Size: {info.getValue()?.size}</div>
          </div>
        ),
      }
    ),
    columnHelper.accessor((row) => row.currentHighestBid, {
      id: 'highestBid',
      header: 'Current Highest Bid',
      cell: (info) => (
        <div className='font-bold text-center'>${info.getValue()}</div>
      ),
    }),
    columnHelper.accessor((row) => row.price, {
      id: 'price',
      header: 'My Bid',
      cell: (info) => (
        <div className='font-bold text-center'>${info.getValue()}</div>
      ),
    }),
    {
      id: 'selection',
      header: ({ table }) => (
        <label className='inline-block mb-3.5 lg:mb-4 pl-4 relative cursor-pointer select-none peer'>
          <input
            type='checkbox'
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
          />
          <span className='absolute top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
        </label>
      ),
      cell: ({ row }) => (
        <div className='text-right'>
          <label className='inline-block mb-3.5 lg:mb-4 pl-4 relative cursor-pointer select-none peer'>
            <input
              type='checkbox'
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
            />
            <span className='absolute top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
          </label>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: currentBids,
    columns: columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const calculateSelectedSum = useCallback(() => {
    return table.getSelectedRowModel().flatRows.reduce((sum, row) => {
      return sum + row.original.price;
    }, 0);
  }, [table]);

  useEffect(() => {
    setSelectedSum(calculateSelectedSum());
  }, [table, setSelectedSum, calculateSelectedSum]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
      ) : currentBids.length === 0 ? (
        <div className='mt-8 lg:mt-12 text-xl flex w-full justify-center'>
          You have no current bids
        </div>
      ) : (
        <div className='mt-8 lg:mt-12'>
          <table className='min-w-full bg-transparent'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={
                        header.id === 'selection'
                          ? { textAlign: 'right' }
                          : header.id === 'Item'
                          ? { textAlign: 'left' }
                          : { textAlign: 'center' }
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='bg-transparent'>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    index < table.getRowModel().rows.length - 1
                      ? 'border-b-2 border-black'
                      : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='py-2'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default CurrentUserBidsTable;
