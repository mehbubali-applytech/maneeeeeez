import Wrapper from "@/components/layouts/DefaultWrapper";
import HrReportsMainArea from "@/components/pagesUI/owner/reports/hr/HrReportsMainArea";
import MyPlanMainArea from "@/components/pagesUI/owner/subscription/MyPlanMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Business Owner &#8211; HR Reports">
        <Wrapper role="owner">
          <HrReportsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
