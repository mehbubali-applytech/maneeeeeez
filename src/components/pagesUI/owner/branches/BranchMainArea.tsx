// BranchMainArea.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import BranchTable from "./BranchTable";
import { IBranch } from "./BranchTypes";
import AddBranchModal from "./AddBranchModal";
import UpdateBranchModal from "./UpdateBranchModal";
import BranchSummary from "./BranchSummary";
import { useRouter } from "next/navigation";

const BranchMainArea: React.FC = () => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);

  const router = useRouter();
  useEffect(() => {
    setBranches([
  {
    id: 1,
    branchName: "Mumbai Head Office",
    branchCode: "MH-001",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    addressLine1: "123 Business Bay",
    addressLine2: "Andheri East",
    zipCode: "400069",
    phone: "+91 9876543210",
    email: "mumbai.hq@company.com",
    managerName: "Rahul Sharma",
    managerEmail: "rahul.sharma@company.com",
    totalEmployees: 120,
    status: "Active",
    createdAt: "2023-01-15",
    updatedAt: "2024-10-10",
  },
  {
    id: 2,
    branchName: "Delhi Corporate Office",
    branchCode: "DL-010",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    addressLine1: "78 Connaught Place",
    addressLine2: "Block B",
    zipCode: "110001",
    phone: "+91 9123456780",
    email: "delhi.office@company.com",
    managerName: "Priya Verma",
    managerEmail: "priya.verma@company.com",
    totalEmployees: 85,
    status: "Active",
    createdAt: "2023-03-22",
    updatedAt: "2024-08-11",
  },
  {
    id: 3,
    branchName: "Bangalore Branch",
    branchCode: "BLR-020",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    addressLine1: "Tech Park Road",
    addressLine2: "Whitefield",
    zipCode: "560066",
    phone: "+91 9934567811",
    email: "bangalore.branch@company.com",
    managerName: "Arjun Rao",
    managerEmail: "arjun.rao@company.com",
    totalEmployees: 60,
    status: "Active",
    createdAt: "2023-05-10",
    updatedAt: "2024-09-18",
  },
  {
    id: 4,
    branchName: "Hyderabad Operations",
    branchCode: "HYD-033",
    country: "India",
    state: "Telangana",
    city: "Hyderabad",
    addressLine1: "Skyline Towers",
    addressLine2: "Hitec City",
    zipCode: "500081",
    phone: "+91 9098765432",
    email: "hyd.ops@company.com",
    managerName: "Sanjana Iyer",
    managerEmail: "sanjana.iyer@company.com",
    totalEmployees: 45,
    status: "Inactive",
    createdAt: "2022-12-01",
    updatedAt: "2024-07-25",
  },
  {
    id: 5,
    branchName: "Chennai Branch",
    branchCode: "CHE-017",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    addressLine1: "Ocean View Road",
    addressLine2: "Adyar",
    zipCode: "600020",
    phone: "+91 9812345671",
    email: "chennai.branch@company.com",
    managerName: "Deepak Kumar",
    managerEmail: "deepak.kumar@company.com",
    totalEmployees: 52,
    status: "Active",
    createdAt: "2023-02-11",
    updatedAt: "2024-06-16",
  },
  {
    id: 6,
    branchName: "Pune Support Center",
    branchCode: "PUN-005",
    country: "India",
    state: "Maharashtra",
    city: "Pune",
    addressLine1: "Green Valley Road",
    addressLine2: "Kharadi",
    zipCode: "411014",
    phone: "+91 9822334455",
    email: "pune.support@company.com",
    managerName: "Megha Joshi",
    managerEmail: "megha.joshi@company.com",
    totalEmployees: 33,
    status: "Closed",
    createdAt: "2021-09-19",
    updatedAt: "2024-05-01",
  },
  {
    id: 7,
    branchName: "Kolkata East Branch",
    branchCode: "KOL-008",
    country: "India",
    state: "West Bengal",
    city: "Kolkata",
    addressLine1: "Riverfront Road",
    addressLine2: "Salt Lake",
    zipCode: "700091",
    phone: "+91 9001234567",
    email: "kolkata.east@company.com",
    managerName: "Ananya Sen",
    managerEmail: "ananya.sen@company.com",
    totalEmployees: 39,
    status: "Active",
    createdAt: "2023-04-05",
    updatedAt: "2024-09-10",
  },
  {
    id: 8,
    branchName: "Ahmedabad Zone Office",
    branchCode: "AMD-011",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    addressLine1: "Heritage Plaza",
    addressLine2: "Navrangpura",
    zipCode: "380009",
    phone: "+91 9654321890",
    email: "ahmedabad.zone@company.com",
    managerName: "Hetal Desai",
    managerEmail: "hetal.desai@company.com",
    totalEmployees: 41,
    status: "Active",
    createdAt: "2022-11-17",
    updatedAt: "2024-09-30",
  },
  {
    id: 9,
    branchName: "Jaipur Regional Branch",
    branchCode: "JAI-022",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur",
    addressLine1: "Pink Square Complex",
    addressLine2: "Tonk Road",
    zipCode: "302015",
    phone: "+91 9912341111",
    email: "jaipur.branch@company.com",
    managerName: "Rohit Choudhary",
    managerEmail: "rohit.choudhary@company.com",
    totalEmployees: 28,
    status: "Inactive",
    createdAt: "2023-08-01",
    updatedAt: "2024-09-02",
  },
  {
    id: 10,
    branchName: "Surat Office",
    branchCode: "SUR-014",
    country: "India",
    state: "Gujarat",
    city: "Surat",
    addressLine1: "Diamond Road",
    addressLine2: "Varachha",
    zipCode: "395006",
    phone: "+91 9870098700",
    email: "surat.office@company.com",
    managerName: "Kiran Patel",
    managerEmail: "kiran.patel@company.com",
    totalEmployees: 22,
    status: "Active",
    createdAt: "2023-06-12",
    updatedAt: "2024-09-22",
  }
]);


  }, []);

  const openAddModal = () => {
    setEditingBranch(null);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    router.push("/owner/branches/add-branch");
  }

  const openEditModal = (branch: IBranch) => {
    setEditingBranch(branch);
    setModalOpen(true);
  };

  const handleSaveBranch = (payload: Partial<IBranch>) => {
    // if payload has id -> update; otherwise create new
    if (payload.id) {
      setBranches((prev) =>
        prev.map((b) => (b.id === payload.id ? { ...b, ...(payload as IBranch) } : b))
      );
    } else {
      const newId = branches.length ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
      setBranches((prev) => [{ ...(payload as IBranch), id: newId }, ...prev]);
    }
    setModalOpen(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = (id: number) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateFromTable = (updated: IBranch) => {
    // called when BranchTable emits onEdit (after modal save)
    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  return (
    <div className="app__slide-wrapper">
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">All Branches</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={handleAddClick}>
            Add Branch
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
        <BranchSummary branches={branches} />
      </div>

      <BranchTable
        key={branches.length}
        data={branches}
        onEdit={(b) => {
          // open edit modal from parent
          setEditingBranch(b);
          setModalOpen(true);
        }}
        onDelete={handleDeleteBranch}
      />

      {/* Add / Edit modals handled at parent level for consistency */}
      {modalOpen && (
        <>
          {!editingBranch ? (
            <AddBranchModal
              open={modalOpen}
              setOpen={setModalOpen}
              onSave={handleSaveBranch}
            />
          ) : (
            <UpdateBranchModal
              open={modalOpen}
              setOpen={setModalOpen}
              editData={editingBranch}
              onSave={(payload) => {
                // payload includes id
                handleSaveBranch(payload);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BranchMainArea;
