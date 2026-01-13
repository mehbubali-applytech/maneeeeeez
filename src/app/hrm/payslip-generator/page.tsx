import Wrapper from "@/components/layouts/DefaultWrapper";
import SalarySlipMainArea from "@/components/pagesUI/hrm/payslip-generator/SalarySlipMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Leave Management">
        <Wrapper>
          <SalarySlipMainArea/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
