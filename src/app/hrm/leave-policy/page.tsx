import Wrapper from "@/components/layouts/DefaultWrapper";
import LeavePolicyMainArea from "@/components/pagesUI/hrm/leave-policy/LeavePolicyMainArea";
import LeaveDashboard from "@/components/pagesUI/hrm/leave/LeaveDashboard";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Leave Policy">
        <Wrapper>
          <LeavePolicyMainArea/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
