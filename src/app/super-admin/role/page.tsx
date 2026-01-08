import Wrapper from "@/components/layouts/DefaultWrapper";
import RoleMainArea from "@/components/pagesUI/super-admin/role/RoleMainArea";
import MetaData from "@/hooks/useMetaData";
import React from "react";

const page = () => {
  return (
    <>
      <MetaData pageTitle="Role Management">
        <Wrapper role="super-admin">
          <RoleMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;
