import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor((row) => row._id, {
    id: '_id',
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('user', {
    header: 'User',
    cell: (info) => (
      <div>
        {info.getValue()?.firstName} {info.getValue()?.lastName}
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: 'Date',
    cell: (info) => info.getValue().substring(0, 10),
  }),
  columnHelper.accessor((row) => row.purchasePrice, {
    id: 'price',
    header: 'Price',
    cell: (info) => <div>${info.getValue()}</div>,
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

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
      <div className='mt-8 font-bold text-xl sm:text-2xl lg:text-3xl'>
        All Orders
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message varinat='Error' text={error?.data?.message || error.error} />
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
                    <td
                      key={cell.id}
                      className={`py-2 px-1 sm:pl-0 border-black border-r-2 sm:border-none ${
                        cell.column.id === '_id'
                          ? 'pl-0'
                          : cell.column.id === 'status' && 'pr-0 border-none'
                      }`}
                    >
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
    </div>
  );
};
export default OrderListScreen;
