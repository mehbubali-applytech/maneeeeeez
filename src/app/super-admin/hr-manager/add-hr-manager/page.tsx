import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import AddEditHrManagerMainArea from "@/components/pagesUI/super-admin/hr-managers/add-hr-manager/AddNewHrManager";

const LogsPage = () => {
  return (
    <>
      <MetaData pageTitle="Add HR Manager">
        <Wrapper role="super-admin">
          <AddEditHrManagerMainArea mode="add" hrManagerData={null}/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default LogsPage;
