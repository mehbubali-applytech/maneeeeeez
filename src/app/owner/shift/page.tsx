import Wrapper from "@/components/layouts/DefaultWrapper";
import ShiftMainArea from "@/components/pagesUI/owner/shift/ShiftMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Shift Management">
        <Wrapper role="owner">
          <ShiftMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
