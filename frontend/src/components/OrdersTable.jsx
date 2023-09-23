import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor((row) => row.orderItem.image, {
    id: 'image',
    cell: (info) => <img src={info.getValue()} alt='Order Item' width='100' />,
    header: '',
  }),
  columnHelper.accessor('orderItem', {
    header: 'Item',
    cell: (info) => (
      <div>
        <div className='text-sm opacity-75'>{info.getValue().name}</div>
        <div className='font-semibold'>{info.getValue().color}</div>
        <div>Size: {info.getValue().size}</div>
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.purchasePrice, {
    id: 'price',
    header: 'Price',
    cell: (info) => <div className='font-bold'>${info.getValue()}</div>,
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    cell: (info) => <div className='text-right'>{info.getValue()}</div>,
  }),
];

const OrderTable = ({ orders }) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='mt-8'>
      <table className='min-w-full bg-transparent'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={
                    header.id === 'status'
                      ? { textAlign: 'right' }
                      : { textAlign: 'left' }
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
              onClick={() => {
                navigate(`/order/${row.original._id}`);
              }}
              className={`cursor-pointer ${
                index < table.getRowModel().rows.length - 1
                  ? 'border-b-2 border-black'
                  : ''
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='py-2'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
