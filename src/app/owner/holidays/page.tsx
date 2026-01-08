import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import HolidayMainArea from "@/components/pagesUI/owner/holidays/HolidayMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Holiday List">
        <Wrapper role={"owner"}>
          <HolidayMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
