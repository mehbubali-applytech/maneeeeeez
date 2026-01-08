"use client";
import React, { useState } from "react";
import Breadcrumb from "@/common/Breadcrumb/breadcrumb";
import ModulesTable from "./ModulesTable";
import AddModuleModal from "./AddModuleModal"
import ModuleTiers from "./ModuleTiers";

const ModulesMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <>
      <div className="app__slide-wrapper">
        <div className="breadcrumb__area">
          <div className="breadcrumb__wrapper mb-[25px]">
            <nav>
              <ol className="breadcrumb flex items-center mb-0">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item active">Module Management</li>
              </ol>
            </nav>
            <div className="breadcrumb__btn">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn btn-primary"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
          {/* Module Tiers Section */}
          <div className="col-span-12 lg:col-span-4">
            <ModuleTiers />
          </div>
          
          {/* Modules Table Section */}
          <div className="col-span-12 lg:col-span-8">
            <ModulesTable />
          </div>
        </div>
      </div>
      
      {modalOpen && <AddModuleModal open={modalOpen} setOpen={setModalOpen} />}
    </>
  );
};

export default ModulesMainArea;