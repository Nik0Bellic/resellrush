import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaCheck, FaEdit, FaTimes } from 'react-icons/fa';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
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
      firstName: row.firstName,
      lastName: row.lastName,
    }),
    {
      id: 'name',
      header: 'Name',
      cell: (info) => (
        <div>
          {info.getValue()?.firstName} {info.getValue()?.lastName}
        </div>
      ),
    }
  ),
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    header: 'Email',
    cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
  }),
  columnHelper.accessor((row) => row.isSeller, {
    id: 'seller',
    header: 'Seller',
    cell: (info) =>
      info.getValue() ? (
        <div className='flex justify-center'>
          <FaCheck style={{ color: 'green' }} />
        </div>
      ) : (
        <div className='flex justify-center'>
          <FaTimes style={{ color: 'red' }} />
        </div>
      ),
  }),
  columnHelper.accessor((row) => row.isAdmin, {
    id: 'admin',
    header: 'Admin',
    cell: (info) =>
      info.getValue() ? (
        <div className='flex justify-center'>
          <FaCheck style={{ color: 'green' }} />
        </div>
      ) : (
        <div className='flex justify-center'>
          <FaTimes style={{ color: 'red' }} />
        </div>
      ),
  }),
  columnHelper.accessor((row) => row._id, {
    id: 'edit',
    header: '',
    cell: (info) => (
      <Link
        className='hover:text-strongYellow'
        to={`/admin/user/${info.getValue()}/edit`}
      >
        <FaEdit />
      </Link>
    ),
  }),
];

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className='mt-8 font-bold text-xl sm:text-2xl lg:text-3xl'>
        All Users
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
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
                    <td
                      key={cell.id}
                      className={`py-2 px-1 sm:pl-0 border-black border-r-2 sm:border-none ${
                        cell.column.id === 'name'
                          ? 'pl-0'
                          : cell.column.id === 'edit' && 'pr-0 border-none'
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
    </>
  );
};
export default UserListScreen;
