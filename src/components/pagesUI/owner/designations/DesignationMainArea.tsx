"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import DesignationTable from "./DesignationTable";
import { IDesignation } from "./DesignationTypes";
import AddDesignationModal from "./AddDesignationModal";
import UpdateDesignationModal from "./UpdateDesignationModal";
import axios from "axios";
import { toast } from "sonner";
import { CircularProgress, Alert, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const DesignationMainArea: React.FC = () => {
  const [designations, setDesignations] = useState<IDesignation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [editingDesignation, setEditingDesignation] = useState<IDesignation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/designation`,
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.data) {
        // Transform data to match IDesignation interface
        const transformedData = response.data.data.map((designation: any) => ({
          // Backend fields
          designation_id: designation.designation_id,
          client_id: designation.client_id,
          department_id: designation.department_id,
          designation_name: designation.designation_name,
          designation_code: designation.designation_code,
          description: designation.description,
          created_at: designation.created_at,

          // Frontend display fields
          id: designation.designation_id,
          name: designation.designation_name,
          designationId: designation.designation_code,
          status: "Active", // Assuming active by default
          departmentName: designation.department?.dept_name,

          // Include department data
          department: designation.department,
        }));

        setDesignations(transformedData);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/");
        return;
      }
      console.error("Error fetching designations:", error);
      setError(error.response?.data?.message || "Failed to load designations");
      toast.error(error.response?.data?.message || "Failed to load designations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const openAddModal = () => {
    setEditingDesignation(null);
    setModalOpen(true);
  };

  const handleSaveDesignation = async (payload: Partial<IDesignation>) => {
    try {
      if (payload.id) {
        // Update existing designation
        const updatePayload = {
          department_id: payload.department_id,
          designation_name: payload.designation_name || payload.name,
          designation_code: payload.designation_code || payload.designationId,
          description: payload.description,
        };

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/designation/${payload.id}`,
          updatePayload,
          {
            withCredentials: true
          }
        );

        if (response.data) {
          await fetchDesignations(); // Refresh data
          toast.success("Designation updated successfully!");
        }
      } else {
        // Create new designation
        const createPayload = {
          department_id: payload.department_id,
          designation_name: payload.designation_name || payload.name,
          designation_code: payload.designation_code || payload.designationId,
          description: payload.description,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/designation`,
          createPayload,
          {
            withCredentials: true
          }
        );

        if (response.status === 201) {
          await fetchDesignations(); // Refresh data
          toast.success("Designation created successfully!");
        }
      }

      setModalOpen(false);
      setEditingDesignation(null);
    } catch (error: any) {

         if (error.response?.status === 401) {
          router.push("/");
          return;
        }
      console.error("Error saving designation:", error);

      let errorMessage = "Failed to save designation";
      if (error.response?.data) {
     
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleDeleteDesignation = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/designation/${id}`,
          {
            withCredentials: true,
          }
        );

        await fetchDesignations(); // Refresh data
        toast.success("Designation deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting designation:", error);
        toast.error(error.response?.data?.message || "Failed to delete designation");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <CircularProgress />
            <p className="mt-2 text-gray-600">Loading designations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app__slide-wrapper">
        <Alert severity="error" className="mb-4">
          <Typography variant="h6">Error loading designations</Typography>
          <Typography>{error}</Typography>
          <button
            onClick={fetchDesignations}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

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
            <li className="breadcrumb-item active">All Designations</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Designation
          </button>
        </div>
      </div>

      <DesignationTable
        data={designations}
        onEdit={(d) => {
          setEditingDesignation(d);
          setModalOpen(true);
        }}
        onDelete={handleDeleteDesignation}
      />

      {modalOpen &&
        (!editingDesignation ? (
          <AddDesignationModal
            open={modalOpen}
            setOpen={setModalOpen}
            onSave={handleSaveDesignation}
          />
        ) : (
          <UpdateDesignationModal
            open={modalOpen}
            setOpen={setModalOpen}
            editData={editingDesignation}
            onSave={handleSaveDesignation}
          />
        ))}
    </div>
  );
};

export default DesignationMainArea;