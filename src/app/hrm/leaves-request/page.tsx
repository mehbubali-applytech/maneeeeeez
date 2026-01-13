import Wrapper from "@/components/layouts/DefaultWrapper";
import LeaveRequestsPanel from "@/components/pagesUI/hrm/leave/LeaveRequestsPanel";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Leave Management">
        <Wrapper>
          <LeaveRequestsPanel/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
