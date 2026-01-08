import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompanyHrManagersMainArea from "@/components/pagesUI/super-admin/hr-managers/[id]/CompanyHrManagersMainArea";

interface Props {
  params: {
    id: number;
  };
}

const CompanyHrManagersPage = ({ params }: Props) => {
  return (
    <>
      <MetaData pageTitle={`HR Managers • ${params.id}`}>
        <Wrapper role="super-admin">
          <CompanyHrManagersMainArea id={params.id} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyHrManagersPage;
