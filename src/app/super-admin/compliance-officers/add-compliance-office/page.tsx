import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import AddNewComplianceOfficer from "@/components/pagesUI/super-admin/compliance-officers/add-compliance-office/AddNewComplianceOfficer";

const ComplianceOfficersPage = () => {
  return (
    <>
      <MetaData pageTitle="Compliance Officers">
        <Wrapper role="super-admin">
          <AddNewComplianceOfficer />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default ComplianceOfficersPage;
