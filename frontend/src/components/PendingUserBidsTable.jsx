import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { FaArrowRightLong } from 'react-icons/fa6';

const PendingUserBidsTable = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.orderItem?.image, {
      id: 'image',
      cell: (info) => (
        <img src={info.getValue()} alt='Order Item' width='100' />
      ),
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

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
      ) : orders.length === 0 ? (
        <div className='mt-8 lg:mt-12 text-xl flex w-full justify-center'>
          You have no pending bids
        </div>
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
  );
};

export default PendingUserBidsTable;
