import Wrapper from "@/components/layouts/DefaultWrapper";
import AddShiftMainArea from "@/components/pagesUI/owner/shift/add-shift/AddShiftMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Add Shift">
        <Wrapper role="owner">
          <AddShiftMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
