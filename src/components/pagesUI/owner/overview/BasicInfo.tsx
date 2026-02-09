"use client";
import React from "react";
import SocialProfile from "../../super-admin/companies/[id]/SocialProfile";
import Link from "next/link";
import Image from "next/image";
import { SessionResponseData } from "../ownerTypes";

interface statePropsType {
  handleToggle: () => void;
  handleSendEmailToggle: () => void;
  companyData: SessionResponseData | null;
}


const BasicInfo = ({
  handleToggle,
  handleSendEmailToggle,
  companyData
}: statePropsType) => {
  const company = companyData?.company;
  const address = company?.company_details?.address;

  const fullAddress = address
    ? `${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.postal_code}`
    : "—";

  return (
    <div className="card__wrapper">
      <div className="company__wrapper">
        <div className="company__info">
          {/* Logo */}
          <div className="company__logo">
            <Image
              src="/assets/images/product/item1.png"
              width={40}
              height={40}
              priority
              alt="Company Logo"
            />
          </div>

          {/* Company Name */}
          <div className="company__name mb-5">
            <h3 className="company__title">{company?.company_name || "—"}</h3>
            <span className="badge badge-success ml-2">
              {company?.status || "—"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="company__btn mb-[30px]">
            <div className="flex flex-wrap items-center justify-between gap-[10px]">
              {/* <button
                onClick={handleToggle}
                type="button"
                className="btn btn-primary w-full"
              >
                Add Deals
              </button> */}
              <button
                onClick={handleSendEmailToggle}
                type="button"
                className="btn btn-secondary w-full"
              >
                Send Mail
              </button>
            </div>
          </div>

          {/* Company Info */}
          <div className="company__info-list">
            <ul>
              <li>
                <span><i className="fa-regular fa-location-dot"></i></span>
                {fullAddress}
              </li>

              <li>
                <span><i className="fa-light fa-phone"></i></span>
                {company?.contact_phone ? (
                  <Link href={`tel:${company.contact_phone}`}>
                    {company.contact_phone}
                  </Link>
                ) : "—"}
              </li>

              <li>
                <span><i className="fa-light fa-envelope"></i></span>
                {company?.contact_email ? (
                  <Link href={`mailto:${company.contact_email}`}>
                    {company.contact_email}
                  </Link>
                ) : "—"}
              </li>

              <li>
                <span><i className="fa-light fa-calendar-clock"></i></span>
                Contract: {company?.contract_start_date || "—"} →{" "}
                {company?.contract_end_date || "—"}
              </li>

              <li>
                <span><i className="fa-solid fa-id-card"></i></span>
                GSTIN: {company?.GSTIN || "—"}
              </li>
            </ul>
          </div>

          {/* Other Info */}
          <div className="company__info-list style-two">
            <h5 className="company__info-list-title">Other Information</h5>
            <ul>
              <li>
                <span>Payment Terms:</span>{" "}
                {company?.company_details?.payment_terms || "—"}
              </li>
              <li>
                <span>Access Level:</span>{" "}
                {company?.company_details?.access_level || "—"}
              </li>
              <li>
                <span>Role:</span>{" "}
                {company?.company_details?.role_name || "—"}
              </li>
            </ul>
          </div>

          {/* Owner Info */}
          <div className="company__info-list style-three">
            <h5 className="company__info-list-title">Owner Information</h5>
            <ul>
              <li>
                <span>Name:</span> {company?.contact_person || "—"}
              </li>
              <li>
                <span>Phone:</span>{" "}
                {company?.contact_phone || "—"}
              </li>
              <li>
                <span>Email:</span>{" "}
                {company?.contact_email || "—"}
              </li>
            </ul>
          </div>

          <SocialProfile />

          {/* Settings */}
          <div className="company__info-list">
            <h5 className="company__info-list-title">Settings</h5>
            <div className="company__social">
              <Link className="table__icon download" href="#">
                <i className="fa-light fa-share-from-square"></i>
              </Link>
              <Link className="table__icon edit" href="#">
                <i className="fa-light fa-bookmark"></i>
              </Link>
              <button className="removeBtn table__icon delete social_trash">
                <i className="fa-regular fa-trash"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
