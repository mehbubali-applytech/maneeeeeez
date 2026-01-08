import Wrapper from "@/components/layouts/DefaultWrapper";
import AddEditRole from "@/components/pagesUI/super-admin/role/add-role/AddRoleMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Add Role">
        <Wrapper role="super-admin">
          <AddEditRole />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
