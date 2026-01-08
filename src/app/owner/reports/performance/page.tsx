import Wrapper from "@/components/layouts/DefaultWrapper";
import PerformanceReportsMainArea from "@/components/pagesUI/owner/reports/performance/PerformanceReportsMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Performance Reports">
        <Wrapper role="owner">
          <PerformanceReportsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
