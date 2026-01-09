import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddVendorMainArea from "@/components/pagesUI/owner/finance/vendors/add-vendor/AddVendorMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Vendor">
        <Wrapper role={"owner"}>
          <AddVendorMainArea />

        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
