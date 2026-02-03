/* eslint-disable react/prop-types */
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { NumberFormatCommas } from "../../utils/FormatText";

const Transactions = ({ history }) => {
  const columns = [
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-cyan-100">{row?._id}</span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => <span className="text-cyan-200">{row?.type}</span>,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => {
        return row?.type === "investment" ? (
          <span className="font-semibold text-cyan-400">
            <NumberFormatCommas value={row?.amount} />
          </span>
        ) : (
          <span className="font-semibold text-red-400">
            <NumberFormatCommas value={row?.investment} />
          </span>
        );
      },
    },
    {
      header: "Date",
      accessor: "date",
      cell: (row) => (
        <span className="text-cyan-200">
          {new Date(row?.createdAt)?.toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "text-center",
      cell: (row) => {
        if (row.status === "Processing") {
          return (
            <span className="px-2 py-1 text-xs font-semibold text-cyan-200 bg-cyan-800/30 rounded-full border border-cyan-700/30">
              {row.status}
            </span>
          );
        } else if (row.status === "Cancelled") {
          return (
            <span className="px-2 py-1 text-xs font-semibold text-red-200 bg-red-500/20 rounded-full border border-red-500/30">
              {row.status}
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 text-xs font-semibold text-cyan-400 bg-cyan-900/20 rounded-full border border-cyan-800/30">
              {row.status}
            </span>
          );
        }
      },
    },
  ];

  return (
    <DataTable
      title="Transactions"
      columns={columns}
      data={history}
      pageSize={10}
      tableClassName="bg-cyan-900/10 text-cyan-100"
      headerClassName="bg-cyan-900/20 text-cyan-200"
    />
  );
};

export default Transactions;
