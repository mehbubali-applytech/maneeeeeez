import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import EmployeesMainArea from "@/components/pagesUI/super-admin/employees/EmployeesMainArea";

const EmployeesPage = () => {
  return (
    <>
      <MetaData pageTitle="Employees">
        <Wrapper role="super-admin">
          <EmployeesMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default EmployeesPage;
