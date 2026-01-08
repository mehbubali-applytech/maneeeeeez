import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompanyFinanceExecutivesMainArea from "@/components/pagesUI/super-admin/finance-executives/[id]/CompanyFinanceExecutivesMainArea";

interface Props {
  params: {
    id: number;
  };
}

const CompanyFinanceExecutivesPage = ({ params }: Props) => {
  return (
    <>
      <MetaData pageTitle={`Finance Executives • ${params.id}`}>
        <Wrapper role="super-admin">
          <CompanyFinanceExecutivesMainArea id={params.id} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyFinanceExecutivesPage;
