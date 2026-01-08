import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import AddNewHrManager from "@/components/pagesUI/super-admin/hr-managers/add-hr-manager/AddNewHrManager";

const LogsPage = () => {
  return (
    <>
      <MetaData pageTitle="Add HR Manager">
        <Wrapper role="super-admin">
          <AddNewHrManager />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default LogsPage;
