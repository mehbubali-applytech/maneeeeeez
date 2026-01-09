import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddStaffMainArea from "@/components/pagesUI/super-admin/staff/add-staff/AddStaffMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Update Staff">
        <Wrapper role="super-admin">
          <AddStaffMainArea mode="edit" />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
