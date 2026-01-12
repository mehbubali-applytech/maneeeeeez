import Wrapper from "@/components/layouts/DefaultWrapper";
import HRAddEditEmployee from "@/components/pagesUI/hrm/employee/HRAddEditEmployee";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Update Employee">
        <Wrapper>
          <HRAddEditEmployee mode="edit" employee={null}/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
