import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import LogsMainArea from "@/components/pagesUI/super-admin/logs/LogsMainArea";

const LogsPage = () => {
  return (
    <>
      <MetaData pageTitle="Support & Logs">
        <Wrapper role="super-admin">
          <LogsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default LogsPage;
