"use client";
import Link from "next/link";
import React, { useState } from "react";
import SubscriptionsTable from "./SubscriptionsTable";
import AddSubscriptionModal from "./AddSubscriptionModal";
import SubscriptionsSummary from "./SubscriptionsSummary";

const SubscriptionsMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
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
                <li className="breadcrumb-item active">Subscriptions</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn btn-primary"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
          <SubscriptionsSummary />
          <SubscriptionsTable />
        </div>
      </div>
      
      {modalOpen && <AddSubscriptionModal open={modalOpen} setOpen={setModalOpen} />}
    </>
  );
};

export default SubscriptionsMainArea;