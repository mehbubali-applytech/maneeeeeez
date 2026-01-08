import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import BranchMainArea from "@/components/pagesUI/owner/branches/BranchMainArea";
import EmployeeAttendanceMainArea from "@/components/pagesUI/owner/attendance/EmployeeAttendanceMainArea";

const AttamdancePage = () => {
  return (
    <>
      <MetaData pageTitle="Attendance">
        <Wrapper role={"owner"}>
          <EmployeeAttendanceMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AttamdancePage;
