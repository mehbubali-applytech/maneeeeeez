import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompanyStaffMainArea from "@/components/pagesUI/super-admin/staff/[id]/CompanyStaffMainArea";

interface Props {
  params: {
    id: number;
  };
}

const CompanyStaffPage = ({ params }: Props) => {
  return (
    <>
      <MetaData pageTitle={`Staff • ${params.id}`}>
        <Wrapper role="super-admin">
          <CompanyStaffMainArea id={params.id} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyStaffPage;
