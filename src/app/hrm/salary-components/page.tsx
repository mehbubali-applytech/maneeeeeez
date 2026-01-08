import Wrapper from "@/components/layouts/DefaultWrapper";
import SalaryComponentsMainArea from "@/components/pagesUI/hrm/salary-components/SalaryComponentsMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Schedule">
        <Wrapper>
          <SalaryComponentsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
