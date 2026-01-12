import Wrapper from "@/components/layouts/DefaultWrapper";
import HRAddEditEmployee from "@/components/pagesUI/hrm/employee/HRAddEditEmployee";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Add Employee">
        <Wrapper>
          <HRAddEditEmployee mode="add" />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
