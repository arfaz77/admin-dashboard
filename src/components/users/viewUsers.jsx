import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useUsersQuery, useDeleteUserMutation, useUserauthenticationQuery } from "../../utils/graphql";
import { useTable,useSortBy, usePagination, useGlobalFilter } from "react-table";
import SearchUser from "../utils/search";
import format from 'date-fns/format'
import UserByMobile from "./userByMobile";
import TabbleOfUsersOrUser from "./tableData";
import LimitedDataPaginationComponents from "../utils/limitedDataPagination";


const ViewUsers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  


  const navigate = useNavigate();

  const { data, loading, error,refetch } = useUsersQuery(({variables:{ skip: currentPage * pageSize,take:pageSize, orderBy: {idNo:"desc"}}}));
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  

  
  if(loading) return <div>Loading....</div>
  console.log("this is the data from view users.", data);
  

  return (
  
    <div className="bg-gray-100 ">
 
   {data?.users &&   <TabbleOfUsersOrUser users={data?.users}/>}

   <LimitedDataPaginationComponents   

          currentPage={currentPage}
      
        onPageChange={handlePageChange}/>
    </div>
  );
};

export default ViewUsers;
