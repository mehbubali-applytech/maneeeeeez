import Wrapper from "@/components/layouts/DefaultWrapper";
import DepartmentsMainArea from "@/components/pagesUI/owner/reports/departments/DepartmentMainArea";
import HrReportsMainArea from "@/components/pagesUI/owner/reports/hr/HrReportsMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Department Reports">
        <Wrapper role="owner">
          <DepartmentsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
