import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import HrManagersMainArea from "@/components/pagesUI/super-admin/hr-managers/HrManagersMainArea";

const LogsPage = () => {
  return (
    <>
      <MetaData pageTitle="Support & Logs">
        <Wrapper role="super-admin">
          <HrManagersMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default LogsPage;
