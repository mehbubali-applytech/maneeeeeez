import Wrapper from "@/components/layouts/DefaultWrapper";
import PayrollVerificationMainArea from "@/components/pagesUI/finance-executive/payroll/verification/PayrollVerificationMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Payroll Verification">
        <Wrapper role="finance-executive">
          <PayrollVerificationMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
