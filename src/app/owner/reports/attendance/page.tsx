import Wrapper from "@/components/layouts/DefaultWrapper";
import AttendanceReportsMainArea from "@/components/pagesUI/owner/reports/attendance/AttendanceReportsMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Department Reports">
        <Wrapper role="owner">
          <AttendanceReportsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
