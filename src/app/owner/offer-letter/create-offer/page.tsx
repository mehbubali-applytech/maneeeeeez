import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import AddEditOfferLetter from "@/components/pagesUI/owner/offer-letter/add-offer/AddEditOfferLetter";


const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Overview">
        <Wrapper role={"owner"}>
          <AddEditOfferLetter mode="add"/>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
