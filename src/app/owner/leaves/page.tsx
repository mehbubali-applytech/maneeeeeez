import Wrapper from "@/components/layouts/DefaultWrapper";
import LeaveMainArea from "@/components/pagesUI/owner/leaves/LeaveMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Leaves">
        <Wrapper role="owner">
          <LeaveMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
