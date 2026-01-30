"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import DepartmentsTable from "./DepartmentTable";
import { IDepartment } from "./DepartmentTypes";
import UpdateDepartmentModal from "./UpdateDepartmentModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import DepartmentSummary from "./DepartmentSummary";

const DepartmentMainArea = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null);
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments from API with tree structure
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.data) {
          // Transform tree data to match IDepartment interface
          const transformDepartment = (dept: any, level = 0): IDepartment => {
            const department: IDepartment = {
              // Backend fields
              dept_id: dept.dept_id,
              client_id: dept.client_id,
              dept_name: dept.dept_name,
              status: dept.status,
              parent_id: dept.parent_id,
              is_parent: dept.is_parent,
              created_at: dept.created_at,

              // Frontend display fields
              id: dept.dept_id,
              departmentName: dept.dept_name || "",
              statusText: dept.status === "1" ? "Active" : "Inactive",
              level: level,
            };

            // Recursively transform children
            if (dept.children && Array.isArray(dept.children)) {
              department.children = dept.children.map((child: any) =>
                transformDepartment(child, level + 1)
              );
            }

            return department;
          };

          const transformedData = response.data.data.map((dept: any) =>
            transformDepartment(dept)
          );

          setDepartments(transformedData);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/");
          return;
        }

        console.error("Error fetching departments:", error);
        setError(error.response?.data?.message || "Failed to load departments");
        toast.error(error.response?.data?.message || "Failed to load departments");
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Filter departments by status
  const filteredDepartments = useMemo(() => {
    if (selectedStatus === "all") return departments;

    const filterTree = (depts: IDepartment[]): IDepartment[] => {
      return depts
        .map((dept) => {
          const children = dept.children
            ? filterTree(dept.children)
            : undefined;

          // If parent matches status or has matching children
          if (
            dept.status === selectedStatus ||
            (children && children.length > 0)
          ) {
            return { ...dept, children };
          }
          return null;
        })
        .filter(Boolean) as IDepartment[];
    };

    return filterTree(departments);
  }, [departments, selectedStatus]);

  const handleAddClick = () => {
    router.push("/owner/departments/add-dept");
  };

  // Handle delete department
  const handleDeleteDepartment = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this department? This will also delete all sub-departments."
      )
    ) {
      try {
        // Show loading toast
        toast.loading("Deleting department...");

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/department/${id}`,
          {
            withCredentials: true,
          }
        );

        // Refresh data after deletion
        await refreshDepartmentsData();

        // Dismiss loading toast and show success
        toast.dismiss();
        toast.success("Department deleted successfully!");

      } catch (error: any) {
        console.error("Error deleting department:", error);
        toast.dismiss();
        toast.error(
          error.response?.data?.message || "Failed to delete department"
        );

        // Even on error, refresh data
        await refreshDepartmentsData();
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "1" ? "0" : "1";

      // Show loading toast
      toast.loading("Updating department status...");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
        { dept_id: id, status: newStatus },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh data after status change
      await refreshDepartmentsData();

      // Dismiss loading toast and show success
      toast.dismiss();
      toast.success("Department status updated successfully!");

    } catch (error: any) {
      console.error("Error updating department status:", error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to update department status"
      );

      // Even on error, refresh data to ensure consistency
      await refreshDepartmentsData();
    }
  };

  const handleEditDepartment = (dept: IDepartment) => {
    setEditingDepartment(dept);
    setModalOpen(true);
  };

  const normalizeStatus = (value: any): "0" | "1" => {
    if (value === true || value === "1" || value === 1) return "1";
    return "0";
  };




  const handleSaveDepartment = async (payload: any) => {
    try {
      if (!editingDepartment) return;

      const normalizedPayload = {
        ...payload,
        status: payload.status !== undefined
          ? normalizeStatus(payload.status)
          : undefined,
        sub_departments: Array.isArray(payload.sub_departments)
          ? payload.sub_departments.map((sd: any) => ({
            ...sd,
            status: normalizeStatus(sd.status),
          }))
          : [],
      };

      // Show loading toast
      toast.loading("Updating department...");

      // Make the API call
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
        normalizedPayload,
        { withCredentials: true }
      );

      // Immediately refresh the departments data
      await refreshDepartmentsData();

      // Dismiss loading toast and show success
      toast.dismiss();
      toast.success("Department updated successfully!");

      setModalOpen(false);
      setEditingDepartment(null);

    } catch (error: any) {
      console.error("Error updating department:", error);
      toast.dismiss();

      let errorMessage = "Failed to update department";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
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

      // Even on error, refresh the data to ensure consistency
      await refreshDepartmentsData();
    }
  };

  // Separate function to refresh department data
  const refreshDepartmentsData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
        { withCredentials: true }
      );

      if (response.data && response.data.data) {
        const transformDepartment = (dept: any, level = 0): IDepartment => {
          const department: IDepartment = {
            dept_id: dept.dept_id,
            client_id: dept.client_id,
            dept_name: dept.dept_name,
            status: dept.status,
            parent_id: dept.parent_id,
            is_parent: dept.is_parent,
            created_at: dept.created_at,
            id: dept.dept_id,
            departmentName: dept.dept_name || "",
            statusText: dept.status === "1" ? "Active" : "Inactive",
            level: level,
            children: dept.children?.map((child: any) =>
              transformDepartment(child, level + 1)
            ),
          };
          return department;
        };

        const transformedData = response.data.data.map((dept: any) =>
          transformDepartment(dept)
        );

        setDepartments(transformedData);
      }
    } catch (error: any) {
      console.error("Error refreshing departments:", error);
      toast.error("Failed to refresh department data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary statistics including hierarchy info
  const summaryData = useMemo(() => {
    const getAllDepartments = (depts: IDepartment[]): IDepartment[] => {
      let all: IDepartment[] = [];
      depts.forEach((dept) => {
        all.push(dept);
        if (dept.children) {
          all = all.concat(getAllDepartments(dept.children));
        }
      });
      return all;
    };

    const allDepartments = getAllDepartments(departments);
    const totalDepartments = allDepartments.length;
    const activeDepartments = allDepartments.filter((dept) => dept.status === "1").length;
    const parentDepartments = departments.filter((dept) => dept.is_parent === 1).length;
    const deepestLevel = Math.max(...allDepartments.map((d) => d.level || 0));

    return {
      totalDepartments,
      activeDepartments,
      inactiveDepartments: totalDepartments - activeDepartments,
      parentDepartments,
      hierarchyDepth: deepestLevel + 1,
    };
  }, [departments]);

  if (isLoading) {
    return (
      <div className="app__slide-wrapper">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-600">Loading departments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app__slide-wrapper">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Error loading departments
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
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
            <li className="breadcrumb-item active">All Departments</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={handleAddClick}>
            Add Department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-6 mb-6">
        <DepartmentSummary summaryData={summaryData} />
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        <DepartmentsTable
          data={filteredDepartments}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Update Modal */}
      {modalOpen && editingDepartment && (
        <UpdateDepartmentModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editingDepartment}
          onSave={handleSaveDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentMainArea;