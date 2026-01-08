import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import AddCompanyMainArea from "@/components/pagesUI/super-admin/companies/add-company/AddCompanyMainArea";

interface Props {
  params: {
    id: number;
  };
}

const CompanyDetailPage = ({ params }: Props) => {
  return (
    <>
      <MetaData pageTitle="Add Company">
        <Wrapper role="super-admin">
          <AddCompanyMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default CompanyDetailPage;
