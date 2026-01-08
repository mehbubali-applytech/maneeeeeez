import Wrapper from "@/components/layouts/DefaultWrapper";
import FinanceReportsMainArea from "@/components/pagesUI/owner/reports/finance/FinanceReportsMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Finance Reports">
        <Wrapper role="owner">
          <FinanceReportsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
