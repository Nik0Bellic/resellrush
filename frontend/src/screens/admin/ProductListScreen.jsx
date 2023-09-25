import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { FaEdit } from 'react-icons/fa';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor(
    (row) => ({
      name: row.name,
      color: row.color,
    }),
    {
      header: 'Item',
      cell: (info) => {
        return (
          <div>
            <div className='text-sm opacity-75'>{info.getValue().name}</div>
            <div className='font-semibold'>{info.getValue().color}</div>
          </div>
        );
      },
    }
  ),
  columnHelper.accessor((row) => row.lowestAsk, {
    id: 'lowestAsk',
    header: 'Lowest Ask',
    cell: (info) => <div className='font-bold'>${info.getValue()}</div>,
  }),
  columnHelper.accessor((row) => row.lastSale, {
    id: 'lastSale',
    header: 'Last Sale',
    cell: (info) => <div className='font-bold'>${info.getValue()}</div>,
  }),
  columnHelper.accessor((row) => row.productIdentifier, {
    id: 'edit',
    header: '',
    cell: (info) => (
      <Link
        className='hover:text-strongYellow'
        to={`/admin/product/${info.getValue()}/edit`}
      >
        <FaEdit />
      </Link>
    ),
  }),
];

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });

  const table = useReactTable({
    data: data?.products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const navigate = useNavigate();

  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        navigate('.', { state: {} });
      }, 10000);
    }
  }, [message, navigate]);

  return (
    <>
      {message && <Message variant='Success' text={message} />}

      <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
        <div className='mt-8 flex justify-between items-center'>
          <div className='font-bold text-xl sm:text-2xl lg:text-3xl'>
            All Products
          </div>
          <Link
            to='/admin/createProduct'
            className='border-2 border-black text-center px-6 py-2 sm:text-lg lg:text-xl rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
          >
            Create Product
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='Error' text={error?.data?.message || error.error} />
        ) : (
          <div className='mt-12'>
            <table className='min-w-full bg-transparent'>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={
                          header.id === 'edit'
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
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </div>
        )}
      </div>
    </>
  );
};
export default ProductListScreen;
