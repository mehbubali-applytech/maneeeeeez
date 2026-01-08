import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import ExpenseMainArea from "@/components/pagesUI/expense/ExpenseMainArea";

const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Expense">
        <Wrapper role={"owner"}>
          <ExpenseMainArea/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
