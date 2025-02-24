import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Text,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const CommonCheckTable = ({ columnsData, tableData, title, ...rest }) => {
  // Ensure tableData is always an array
  const data = useMemo(() => (Array.isArray(tableData) ? tableData : []), [tableData]);
  const columns = useMemo(() => columnsData, [columnsData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {/* Table Header */}
      <Flex
        direction={{ sm: "column", md: "row" }}
        align={{ sm: "start", md: "center" }}
        justify="space-between"
        mb="1rem"
      >
        <Text fontSize="xl" fontWeight="bold" mb={{ sm: "6px", md: "0px" }}>
          {title}
        </Text>
        {/* Search Input */}
        <Input
          type="text"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          maxW="300px"
        />
      </Flex>

      {/* Table */}
      <TableContainer>
        <Table {...getTableProps()} variant="simple">
          <Thead>
            {headerGroups.map((headerGroup, idx) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, idx) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, index) => (
                    <Td {...cell.getCellProps()} key={index}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Flex justify="space-between" m={4} align="center">
        <Flex>
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            mr={2}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <ChevronRightIcon />
          </Button>
          <Text ml={4}>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Text>
        </Flex>
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          width="100px"
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
};

export default CommonCheckTable;
