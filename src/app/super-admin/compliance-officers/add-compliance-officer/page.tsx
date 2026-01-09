import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import AddEditComplianceOfficerMainArea from "@/components/pagesUI/super-admin/compliance-officers/add-compliance-office/AddNewComplianceOfficer";

const ComplianceOfficersPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Compliance Officers">
        <Wrapper role="super-admin">
          <AddEditComplianceOfficerMainArea mode="add" complianceOfficerData={null} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default ComplianceOfficersPage;
