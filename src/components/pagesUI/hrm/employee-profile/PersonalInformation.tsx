"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import UpdateEmployeeProfileModal from "./UpdateEmployeeProfileModal";
import { IEmployee } from "@/interface";

interface propsType {
  data: any;
}

const PersonalInformation = ({ data }: propsType) => {
  const [modalOpen, setModalOpen] = useState(false);

  const dob = data?.attributes?.find(
    (a: any) => a.attribute_key === "DOB"
  )?.attribute_value;

  const gender = data?.attributes?.find(
    (a: any) => a.attribute_key === "Gender"
  )?.attribute_value;

  // Add fallback image or conditional rendering
  const imageSrc = data?.image || '/images/default-avatar.png'; // Add a fallback image
  
  // Or check if image exists before rendering Image component
  const hasValidImage = data?.image && data.image.trim() !== '';

  return (
    <>
      <div className="col-span-12 xxl:col-span-7">
        <div className="card__wrapper height-equal">
          <div className="employee__profile-single-box relative">
            <div className="card__title-wrap flex items-center justify-between mb-[15px]">
              <h5 className="card__heading-title">Personal Information</h5>
              <button
                type="button"
                className="edit-icon"
                onClick={() => setModalOpen(true)}
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            </div>
            <div className="profile-view flex flex-wrap justify-between items-start">
              <div className="flex flex-wrap items-start gap-[10px] sm:gap-[20px]">
                <div className="profile-img-wrap">
                  <div className="profile-img">
                    <Link href="#">
                      {hasValidImage ? (
                        <Image
                          src={data.image}
                          width={100}
                          height={100}
                          priority
                          style={{ width: "100%", height: "auto" }}
                          alt={`${data?.info?.first_name} ${data?.info?.last_name} image`}
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        // Fallback content when no image
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                          <span className="text-gray-500 text-lg font-semibold">
                            {data?.info?.first_name?.[0]}{data?.info?.last_name?.[0]}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                </div>
                <div className="profile-info">
                  <h3 className="user-name mb-[15px]">{data?.info?.first_name} {data?.info?.last_name}</h3>
                  <h6 className="text-muted mb-[5px]">{data?.info?.designation}</h6>
                  <span className="block text-muted">{data?.info?.designation}</span>
                  <h6 className="small employee-id text-black mb-[5px] mt-[5px]">
                    Employee ID : {data?.info?.employee_code}
                  </h6>
                  <span className="block text-muted">
                    Date of Join : {data?.info?.date_of_joining}
                  </span>
                  <div className="employee-msg mt-[20px]">
                    <button className="btn btn-primary">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
              <div className="personal-info-wrapper pe-5">
                <ul className="personal-info">
                  <li>
                    <div className="title">Phone:</div>
                    <div className="text text-link-hover">
                      <Link href={`tel:${data?.phone}`}>{data?.phone}</Link>
                    </div>
                  </li>
                  <li>
                    <div className="title">Email:</div>
                    <div className="text text-link-hover">
                      <Link href={`mailto:${data?.info?.email}`}>
                        {data?.info?.email}
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="title">Birthday:</div>
                    <div className="text">{dob || 'N/A'}</div>
                  </li>
                  <li>
                    <div className="title">Address:</div>
                    <div className="text">
                      {data?.info?.address || '100 Terminal, Fort Lauderdale, Miami 33315, United States'}
                    </div>
                  </li>
                  <li>
                    <div className="title">Gender:</div>
                    <div className="text">{gender || 'N/A'}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <UpdateEmployeeProfileModal
          open={modalOpen}
          setOpen={setModalOpen}
          data={data}
        />
      )}
    </>
  );
};

export default PersonalInformation;