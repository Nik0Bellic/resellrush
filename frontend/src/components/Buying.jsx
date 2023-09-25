import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Message from './Message';
import Loader from './Loader';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FaArrowRightLong } from 'react-icons/fa6';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor((row) => row.orderItem?.image, {
    id: 'image',
    cell: (info) => <img src={info.getValue()} alt='Order Item' width='100' />,
    header: '',
  }),
  columnHelper.accessor('orderItem', {
    header: 'Item',
    cell: (info) => (
      <div>
        <div className='text-sm opacity-75'>{info.getValue()?.name}</div>
        <div className='font-semibold'>{info.getValue()?.color}</div>
        <div>Size: {info.getValue()?.size}</div>
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
    cell: (info) => (
      <div className='flex flex-col justify-between items-end h-24 py-2'>
        <div>{info.getValue()}</div>
        <Link
          className='flex items-center hover:text-strongYellow'
          to={`/order/${info.row.original._id}`}
        >
          <span>Details</span>
          <FaArrowRightLong className='ml-2 hidden sm:inline' />
        </Link>
      </div>
    ),
  }),
];

const Buying = () => {
  const [buyingType, setBuyingType] = useState('current');

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className='flex justify-between border-2 border-black rounded-full relative h-12 md:h-[3.28rem] w-full md:text-lg lg:text-xl'>
        <input
          type='radio'
          id='current'
          name='buyingType'
          onClick={() => setBuyingType('current')}
          className='peer hidden'
        />
        <label
          htmlFor='current'
          className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute ${
            buyingType === 'current' &&
            'border-2 border-black bg-strongYellow rounded-full -ml-0.5 -mt-0.5'
          }`}
        >
          Current
        </label>
        <input
          type='radio'
          id='pending'
          name='buyingType'
          onClick={() => setBuyingType('pending')}
          className='peer hidden'
        />
        <label
          htmlFor='pending'
          className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute left-1/2 transform -translate-x-1/2 ${
            buyingType === 'pending' &&
            'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
          }`}
        >
          Pending
        </label>
        <input
          type='radio'
          id='history'
          name='buyingType'
          onClick={() => setBuyingType('history')}
          className='peer hidden'
        />
        <label
          htmlFor='history'
          className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute right-0 ${
            buyingType === 'history' &&
            'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
          }`}
        >
          History
        </label>
      </div>
      {buyingType === 'pending' && (
        <>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message
              varinat='Error'
              text={error?.data?.message || error.error}
            />
          ) : (
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
      )}
    </>
  );
};
export default Buying;
