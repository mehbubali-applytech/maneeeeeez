import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import VendorMainArea from "@/components/pagesUI/owner/finance/vendors/VendorMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Vendor">
        <Wrapper role={"owner"}>
          <VendorMainArea />

        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
