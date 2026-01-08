import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AppInvoiceAddMainArea from "@/components/pagesUI/owner/finance/invoice/AppInvoiceAddMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Invoice">
        <Wrapper role={"owner"}>
          <AppInvoiceAddMainArea/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
