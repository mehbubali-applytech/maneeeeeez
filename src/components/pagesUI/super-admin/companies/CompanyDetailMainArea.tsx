"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import { ICompany } from "./companies.interface";
import Image from 'next/image';

interface Props {
  id: number;
}

const dummyCompaniesData: ICompany[] = [
  {
    id: 1,
    name: "TechVision Pvt Ltd",
    location: "Bangalore, India",
    phone: "080-23456789",
    mobile: "+91-9876543210",
    fax: "080-987654",
    websites: "https://techvision.com",
    industry: "Software",
    currencyType: "INR",
    source: "LinkedIn",
    description: "A leading software development company",
    language: "English",
    country: "India",
    city: "Bangalore",
    zipCode: "560001",
    state: "Karnataka",
    address: "MG Road, Bangalore",
    email: "contact@techvision.com",
    owner: "Rahul Sharma",
    rating: 4.5,
    tag: "IT",
    status: "Active",
    companyImg: undefined,
  },
];

const CompanyDetailMainArea: React.FC<Props> = ({ id }) => {
  const [company, setCompany] = useState<ICompany | null>(null);

  useEffect(() => {
    console.log("Fetching details for company ID:", id);
    const found = dummyCompaniesData.find((c) => c.id === id);
    setCompany(found || null);
  }, [id]);

  if (!company) {
    return (
      <div className="app__slide-wrapper">
        <Breadcrumb breadTitle="Company Not Found" subTitle="Super Admin" />
        <div className="card">
          <div className="card__body text-center">
            <p className="text-danger mb-4">Company with ID &quot;{id}&quot; not found.</p>
            <Link href="/super-admin/companies" className="btn btn-primary">
              Back to Companies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app__slide-wrapper">
      <Breadcrumb breadTitle={`${company.name} Details`} subTitle="Super Admin" />

      <div className="grid grid-cols-12 gap-5">

        {/* Navigation Buttons */}
        <div className="col-span-12">
          <div className="card">
            <div className="card__body flex gap-3 flex-wrap">
              <Link href={`/super-admin/staff/${company.id}`} className="btn btn-primary">All Staff</Link>
              <Link href={`/super-admin/hr-manager/${company.id}`} className="btn btn-primary">HR Manager</Link>
              <Link href={`/super-admin/finance-executives/${company.id}`} className="btn btn-secondary">Finance Executive</Link>
              <Link href={`/super-admin/compliance-officers/${company.id}`} className="btn btn-danger">Compliance Officer</Link>
              <Link href={`/super-admin/companies`} className="btn btn-outline-secondary">Back to Companies</Link>
            </div>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="col-span-12">
          <div className="card">
            <div className="card__header"><h5 className="card__title">Basic Information</h5></div>

            <div className="card__body grid grid-cols-12 gap-4">
              <div className="col-span-4"><strong>Name:</strong><p>{company.name}</p></div>
              <div className="col-span-4"><strong>Location:</strong><p>{company.location}</p></div>
              <div className="col-span-4"><strong>Industry:</strong><p>{company.industry || "—"}</p></div>

              <div className="col-span-4"><strong>Source:</strong><p>{company.source || "—"}</p></div>
              <div className="col-span-4"><strong>Language:</strong><p>{company.language || "—"}</p></div>
              <div className="col-span-4"><strong>Rating:</strong><p>{company.rating}</p></div>

              <div className="col-span-4"><strong>Tag:</strong><p>{company.tag}</p></div>
              <div className="col-span-4"><strong>Status:</strong><p>{company.status}</p></div>

              <div className="col-span-12">
                <strong>Description:</strong>
                <p>{company.description || "—"}</p>
              </div>

              <div className="col-span-12">
                <strong>Company Logo:</strong>
                {company.companyImg ? (
                 <Image src={company.companyImg.src} alt="Company Logo" width={150} height={150} />
                ) : (
                  <p className="text-muted">No logo uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="col-span-12">
          <div className="card">
            <div className="card__header"><h5 className="card__title">Address</h5></div>

            <div className="card__body grid grid-cols-12 gap-4">
              <div className="col-span-6"><strong>Address:</strong><p>{company.address || "—"}</p></div>
              <div className="col-span-3"><strong>City:</strong><p>{company.city}</p></div>
              <div className="col-span-3"><strong>State:</strong><p>{company.state || "—"}</p></div>
              <div className="col-span-4"><strong>Country:</strong><p>{company.country}</p></div>
              <div className="col-span-4"><strong>Zip Code:</strong><p>{company.zipCode || "—"}</p></div>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="col-span-12">
          <div className="card">
            <div className="card__header"><h5 className="card__title">Contact Information</h5></div>

            <div className="card__body grid grid-cols-12 gap-4">
              <div className="col-span-4"><strong>Owner:</strong><p>{company.owner}</p></div>
              <div className="col-span-4"><strong>Email:</strong><p>{company.email}</p></div>
              <div className="col-span-4"><strong>Phone:</strong><p>{company.phone || "—"}</p></div>

              <div className="col-span-4"><strong>Mobile:</strong><p>{company.mobile || "—"}</p></div>
              <div className="col-span-4"><strong>Fax:</strong><p>{company.fax || "—"}</p></div>
              <div className="col-span-4"><strong>Website:</strong><p>{company.websites || "—"}</p></div>
            </div>
          </div>
        </div>

        {/* FINANCIAL / SYSTEM */}
        <div className="col-span-12">
          <div className="card">
            <div className="card__header"><h5 className="card__title">Financial & System Details</h5></div>

            <div className="card__body grid grid-cols-12 gap-4">
              <div className="col-span-4"><strong>Currency Type:</strong><p>{company.currencyType || "—"}</p></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDetailMainArea;
