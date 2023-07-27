
import { Button } from "@material-tailwind/react";
import React, { useMemo, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTable, usePagination, useGlobalFilter,useSortBy } from "react-table";
import { useContactUsQuery, useUpdateContactUsMutation} from "../../utils/graphql";
import SearchUser from "../utils/search";

import Swal from "sweetalert2";
import format from 'date-fns/format'
import TableComponent from "../utils/table";
import PaginationComponents from "../utils/pagination";


const ViewQueries = () => {
 
  const navigate = useNavigate();
  const { data, loading, error,refetch } = useContactUsQuery();
  console.log(data)
  const [updateStatus]=useUpdateContactUsMutation()
  
 
  const handleChangeStatus=async(quiryId)=>{

    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'question',
      text:"Change status to solved ?",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
        const Result = await updateStatus({
          variables: { where: { id: quiryId },data:{status:'solved'} },
        });
  
refetch()
 
  
  }
}

  

  const columns = useMemo(
    () => [
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Mobile", accessor: "mobile" },
      { Header: "Created At ", accessor: ({createdAt})=>{return format(new Date( createdAt),`dd/MM/yy, HH:mm`)} },
      { Header: "Updated At ",  accessor: ({updatedAt})=>{return format(new Date( updatedAt),`dd/MM/yy, HH:mm`)} },
      {Header:"Subject",accessor:"subject"},
      {Header:"Message",accessor:"message"},
     
      {
        Header: "Status",
        Cell: ({ row }) => (
    row.original.status==='created' ?     <button className="btn bg-red-500" onClick={() => handleChangeStatus(row.original?.id)}>{row.original.status}</button>:<p className="text-green-500 font-bold">Solved</p> 
        )
      },
      
 
    ],
    []
  );


  const tableData=useMemo(() => (data ? data.contactuses : []), [data]);
  
  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        sortBy: [
          {
            id: "eventsCount",
            desc: true,
          },
        ],
      },
    },
   
    useGlobalFilter,
    useSortBy,
    usePagination,
    
    
  );
 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,

    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    pageCount,
    gotoPage,
    setPageSize: setTablePageSize,
    state: { pageIndex: tablePageIndex, pageSize: tablePageSize },
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

   
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error}</p>;

  return (
    <div className="w-full  h-full ">
   
    <div className="  max-w-6xl mx-auto h-fit ">
      <div className="   flex flex-col justify-center m-auto w-full">
   
          <div className="text-center font-extrabold my-5 text-lg w-full">
            Enquiries{" "}
          </div>
          <SearchUser
            filter={globalFilter}
            className="  text-white "
            setFilter={setGlobalFilter}
          />
    

      
        <TableComponent tableData={tableInstance}/>
        <PaginationComponents tableData={tableInstance}/>
      </div>
    </div>
  </div>
  )
}

export default ViewQueries