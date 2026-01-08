import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddStaffMainArea from "@/components/pagesUI/super-admin/staff/add-staff/AddStaffMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Staff">
        <Wrapper role="super-admin">
          <AddStaffMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
