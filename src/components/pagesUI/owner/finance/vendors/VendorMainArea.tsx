"use client";
import Link from "next/link";
import React, { useState } from "react";
import VendorTable from "./VendorTable";
import VendorSummary from "./VendorSummary";
import { useRouter } from "next/navigation";

const VendorMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  
  return (
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__area">
          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Finance</li>
                <li className="breadcrumb-item active">Vendors</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => router.push('/owner/finance/vendors/add-vendor')}
                className="btn btn-primary"
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
          <VendorSummary />
          <VendorTable />
        </div>
      </div>
      
    </>
  );
};

export default VendorMainArea;