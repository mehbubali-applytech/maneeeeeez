import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import ModulesMainArea from "@/components/pagesUI/super-admin/modules/ModulesMainArea";

const ModulesPage = () => {
  return (
    <>
      <MetaData pageTitle="Module Management">
        <Wrapper role="super-admin">
          <ModulesMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default ModulesPage;
