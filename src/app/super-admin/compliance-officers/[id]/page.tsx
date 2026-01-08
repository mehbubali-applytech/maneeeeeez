import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompanyComplianceOfficersMainArea from "@/components/pagesUI/super-admin/compliance-officers/[id]/CompanyComplianceOfficersMainArea";

interface Props {
  params: {
    id: number;
  };
}

const CompanyComplianceOfficersPage = ({ params }: Props) => {
  return (
    <>
      <MetaData pageTitle={`Compliance Officers • ${params.id}`}>
        <Wrapper role="super-admin">
          <CompanyComplianceOfficersMainArea id={params.id} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyComplianceOfficersPage;
