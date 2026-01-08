import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import FinanceExecutivesMainArea from "@/components/pagesUI/super-admin/finance-executives/FinanceExecutivesMainArea";
import AddNewFinanceExecutive from "@/components/pagesUI/super-admin/finance-executives/add-finance-executive/AddNewFinanceExecutive";

const FinanceExecutivesPage = () => {
  return (
    <>
      <MetaData pageTitle="Add Finance Executives">
        <Wrapper role="super-admin">
          <AddNewFinanceExecutive />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default FinanceExecutivesPage;
