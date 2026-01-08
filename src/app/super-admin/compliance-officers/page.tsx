import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import ComplianceOfficersMainArea from "@/components/pagesUI/super-admin/compliance-officers/ComplianceOfficersMainArea";

const ComplianceOfficersPage = () => {
  return (
    <>
      <MetaData pageTitle="Compliance Officers">
        <Wrapper role="super-admin">
          <ComplianceOfficersMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default ComplianceOfficersPage;
