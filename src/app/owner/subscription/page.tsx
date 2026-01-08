import Wrapper from "@/components/layouts/DefaultWrapper";
import MyPlanMainArea from "@/components/pagesUI/owner/subscription/MyPlanMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="SubScriptions">
        <Wrapper role="owner">
          <MyPlanMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
