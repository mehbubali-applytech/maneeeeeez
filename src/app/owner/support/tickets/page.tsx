import Wrapper from "@/components/layouts/DefaultWrapper";
import TicketsMainArea from "@/components/pagesUI/owner/support/tickets/TicketsMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="SubScriptions">
        <Wrapper role="owner">
          <TicketsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
