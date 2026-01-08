import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import CompanyEmployeesMainArea from "@/components/pagesUI/super-admin/employees/[id]/CompanyEmployeesMainArea";

interface Props {
  params: {
    id: string;
  };
}

const CompanyEmployeesPage = ({ params }: Props) => {
  return (
    <>
      <MetaData pageTitle={`Employees • ${params.id}`}>
        <Wrapper role="super-admin">
          <CompanyEmployeesMainArea employeeId={params.id} />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyEmployeesPage;
