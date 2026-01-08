import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import ReportsMainArea from "@/components/pagesUI/super-admin/reports/ReportsMainArea";

const ReportsPage = () => {
  return (
    <>
      <MetaData pageTitle="Reports & Analytics">
        <Wrapper role="super-admin">
          <ReportsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default ReportsPage;
