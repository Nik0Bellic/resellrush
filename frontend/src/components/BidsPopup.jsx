import { useSelector } from 'react-redux';
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductBidsQuery } from '../slices/productsApiSlice';

const BidsPopup = ({ productId, bidsModalActive, setBidsModalActive }) => {
  const { selectedSize } = useSelector((state) => state.size);
  const {
    data: bids = [],
    isLoading,
    error,
  } = useGetProductBidsQuery(
    { productId, size: selectedSize },
    { skip: !selectedSize }
  );

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.quantity, {
      id: 'quantity',
      header: 'Quantity',
      cell: (info) => info.getValue(),
    }),
    {
      id: 'size',
      header: 'Size',
      cell: () => <div>US M {selectedSize}</div>,
    },
    columnHelper.accessor((row) => row.price, {
      id: 'price',
      header: 'Bid Price',
      cell: (info) => <div className='font-bold'>${info.getValue()}</div>,
    }),
  ];

  const table = useReactTable({
    data: bids,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={`w-[100vw] h-[100vh] bg-black bg-opacity-60 fixed top-0 left-0 flex justify-center items-center opacity-0 pointer-events-none duration-300 z-30 ${
        bidsModalActive && 'opacity-100 pointer-events-auto'
      }`}
      onClick={() => setBidsModalActive(false)}
    >
      <div
        className={`border-2 border-black rounded-2xl p-6 bg-white scale-0 duration-500 w-80 md:w-96 ${
          bidsModalActive && 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='Error' text={error?.data?.message || error.error} />
        ) : bids.length === 0 ? (
          <div className='mt-8 lg:mt-12 text-xl flex w-full justify-center'>
            No Bids For This Size Yet
          </div>
        ) : (
          <>
            <div className='font-semibold text-lg mb-6 text-center'>
              All Bids
            </div>
            <table className='min-w-full bg-transparent'>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} style={{ textAlign: 'center' }}>
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
                        ? 'border-b-2 border-black text-center'
                        : 'text-center'
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
          </>
        )}
      </div>
    </div>
  );
};
export default BidsPopup;
