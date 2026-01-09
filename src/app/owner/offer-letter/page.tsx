import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import React from "react";
import OfferLetterMainArea from "@/components/pagesUI/owner/offer-letter/OfferLetterMainArea";


const AllCompaniesPage = () => {
  return (
    <>
      <MetaData pageTitle="Overview">
        <Wrapper role={"owner"}>
          <OfferLetterMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default AllCompaniesPage;
