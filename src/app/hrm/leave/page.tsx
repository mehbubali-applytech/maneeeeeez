import Wrapper from "@/components/layouts/DefaultWrapper";
import LeaveDashboard from "@/components/pagesUI/hrm/leave/LeaveDashboard";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Leave Management">
        <Wrapper>
          <LeaveDashboard/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
