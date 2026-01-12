import Wrapper from "@/components/layouts/DefaultWrapper";
import HREmployeeProfileMainArea from "@/components/pagesUI/hrm/employee/[id]/HREmployeeProfileMainArea";
import EmployeeMainArea from "@/components/pagesUI/hrm/employee/EmployeeMainArea";
import HREmployeeMainArea from "@/components/pagesUI/hrm/employee/HREmployeeMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Employee Profile">
        <Wrapper>
          <HREmployeeProfileMainArea employeeId="1" />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
