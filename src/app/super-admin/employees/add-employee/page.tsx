import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import EmployeesMainArea from "@/components/pagesUI/super-admin/employees/EmployeesMainArea";
import AddEditEmployee from "@/components/pagesUI/owner/employees/UpdateEmployeeModal";

const EmployeesPage = () => {
  return (
    <>
      <MetaData pageTitle="Employees">
        <Wrapper role="super-admin">
          <AddEditEmployee mode="add"/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default EmployeesPage;
