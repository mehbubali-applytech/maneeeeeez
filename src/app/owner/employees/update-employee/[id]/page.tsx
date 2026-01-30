import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddEditEmployee from "@/components/pagesUI/owner/employees/UpdateEmployeeModal";

interface EditEmployeePageProps {
  params: {
    id: string;
  };
}

export default function EditEmployeePage({ params }: EditEmployeePageProps)  {
  return (
    <>
      <MetaData pageTitle="Update Employees">
        <Wrapper role={"owner"}>
          <AddEditEmployee mode="edit"/>
        </Wrapper>
      </MetaData>
    </>
  );
};

