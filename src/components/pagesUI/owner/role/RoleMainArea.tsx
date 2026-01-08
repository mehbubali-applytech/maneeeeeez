// RoleMainArea.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleTable from "./RoleTable";
import RoleSummary from "./RoleSummary";
import { IRole, IRoleForm } from "./RoleTypes";
import UpdateRoleModal from "./UpdateRoleModal";

const RoleMainArea: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Mock data - replace with API call
    setRoles([
      {
        roleId: 1,
        roleName: "HR Manager",
        roleCode: "HRMGR",
        description: "Manages HR operations, employee relations, and compliance",
        defaultSalaryGrade: "M3",
        permissions: [
          "attendance_view", "attendance_edit", "attendance_approve",
          "leave_view", "leave_apply", "leave_approve",
          "payroll_view", "compliance_view", "reports_view"
        ],
        activeStatus: true,
        assignedUsers: 8,
        createdAt: "2024-01-15",
        updatedAt: "2024-10-10",
      },
      {
        roleId: 2,
        roleName: "Finance Executive",
        roleCode: "FINEXE",
        description: "Handles financial transactions, payroll processing, and reporting",
        defaultSalaryGrade: "G6",
        permissions: [
          "payroll_view", "payroll_process", "payroll_approve",
          "payroll_reports", "reports_view", "reports_export"
        ],
        activeStatus: true,
        assignedUsers: 12,
        createdAt: "2024-02-20",
        updatedAt: "2024-09-15",
      },
      {
        roleId: 3,
        roleName: "Software Engineer",
        roleCode: "ENG1",
        description: "Develops and maintains software applications",
        defaultSalaryGrade: "G5",
        permissions: [
          "attendance_view", "leave_view", "leave_apply"
        ],
        activeStatus: true,
        assignedUsers: 25,
        createdAt: "2024-03-10",
        updatedAt: "2024-10-05",
      },
      {
        roleId: 4,
        roleName: "System Administrator",
        roleCode: "SYSADM",
        description: "Manages system settings, users, and roles",
        defaultSalaryGrade: "M2",
        permissions: [
          "admin_users", "admin_roles", "admin_settings",
          "compliance_view", "compliance_edit", "reports_generate"
        ],
        activeStatus: true,
        assignedUsers: 3,
        createdAt: "2024-01-05",
        updatedAt: "2024-09-20",
      },
      {
        roleId: 5,
        roleName: "Recruitment Specialist",
        roleCode: "RECSPC",
        description: "Handles recruitment and candidate management",
        defaultSalaryGrade: "G4",
        permissions: [
          "recruitment_view", "recruitment_manage", "recruitment_approve",
          "performance_view", "reports_view"
        ],
        activeStatus: false,
        assignedUsers: 0,
        createdAt: "2023-12-15",
        updatedAt: "2024-08-01",
      },
      {
        roleId: 6,
        roleName: "Compliance Officer",
        roleCode: "CMPOFF",
        description: "Ensures regulatory compliance and audits",
        defaultSalaryGrade: "M1",
        permissions: [
          "compliance_view", "compliance_edit", "compliance_reports",
          "reports_view", "reports_generate", "reports_export"
        ],
        activeStatus: true,
        assignedUsers: 5,
        createdAt: "2024-02-28",
        updatedAt: "2024-10-01",
      },
      {
        roleId: 7,
        roleName: "Team Lead",
        roleCode: "TLDR",
        description: "Leads team activities and approves requests",
        defaultSalaryGrade: "G7",
        permissions: [
          "attendance_view", "attendance_approve",
          "leave_view", "leave_approve",
          "performance_view", "performance_manage"
        ],
        activeStatus: true,
        assignedUsers: 15,
        createdAt: "2024-03-15",
        updatedAt: "2024-09-30",
      },
      {
        roleId: 8,
        roleName: "View Only User",
        roleCode: "VIEWONLY",
        description: "Read-only access to reports and dashboards",
        defaultSalaryGrade: "G2",
        permissions: [
          "attendance_view", "leave_view", "reports_view"
        ],
        activeStatus: true,
        assignedUsers: 30,
        createdAt: "2024-01-20",
        updatedAt: "2024-09-25",
      },
    ]);
  }, []);

  const handleAddClick = () => {
    router.push("/owner/role/add-role");
  };

  const handleSaveRole = (payload: Partial<IRole>) => {
    if (payload.roleId) {
      // Update existing role
      setRoles(prev =>
        prev.map(r => 
          r.roleId === payload.roleId ? { ...r, ...payload, updatedAt: new Date().toISOString() } as IRole : r
        )
      );
    } else {
      // Create new role
      const newId = roles.length ? Math.max(...roles.map(r => r.roleId)) + 1 : 1;
      const newRole: IRole = {
        roleId: newId,
        roleName: payload.roleName || "",
        roleCode: payload.roleCode,
        description: payload.description,
        defaultSalaryGrade: payload.defaultSalaryGrade,
        permissions: payload.permissions || [],
        activeStatus: payload.activeStatus !== false,
        assignedUsers: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoles(prev => [newRole, ...prev]);
    }
  };

  // Handle role update from modal
  const handleUpdateRole = async (data: IRoleForm, roleId: number) => {
    try {
      // Update the role in state
      setRoles(prev => 
        prev.map(role => 
          role.roleId === roleId 
            ? { 
                ...role, 
                roleName: data.roleName,
                roleCode: data.roleCode,
                description: data.description,
                defaultSalaryGrade: data.defaultSalaryGrade,
                activeStatus: data.activeStatus,
                permissions: data.permissions,
                updatedAt: new Date().toISOString()
              }
            : role
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  };

  const openEditModal = (role: IRole) => {
    setEditingRole(role);
    setUpdateModalOpen(true);
  };

  const handleDeleteRole = (id: number) => {
    setRoles(prev => prev.filter(r => r.roleId !== id));
  };

  const handleDeleteRoleModal = async (roleId: number) => {
    setRoles(prev => prev.filter(r => r.roleId !== roleId));
  };

  const handleStatusChange = (id: number, status: boolean) => {
    setRoles(prev =>
      prev.map(r =>
        r.roleId === id ? { ...r, activeStatus: status, updatedAt: new Date().toISOString() } : r
      )
    );
  };

  const handleAssignUsers = (roleId: number) => {
    console.log("Assign users for role:", roleId);
    // You can implement a modal or navigate to user assignment page
    // For now, just show an alert
    const role = roles.find(r => r.roleId === roleId);
    alert(`Opening user assignment for role: ${role?.roleName}\n\nIn a real implementation, this would open a user assignment modal with checkboxes for all users.`);
  };

  return (
    <>
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
              <li className="breadcrumb-item active">Roles & Permissions</li>
            </ol>
          </nav>

          <div className="breadcrumb__btn">
            <button
              type="button"
              onClick={handleAddClick}
              className="btn btn-primary"
            >
              <i className="fa-regular fa-user-plus mr-2"></i>
                Add New Role
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0 mb-6">
          <RoleSummary roles={roles} />
        </div>

        <RoleTable
          data={roles}
          onEdit={openEditModal}
          onDelete={handleDeleteRole}
          onStatusChange={handleStatusChange}
          key={roles.length}
        />
      </div>

      {editingRole && (
        <UpdateRoleModal
          open={updateModalOpen}
          setOpen={setUpdateModalOpen}
          editData={editingRole}
          onSave={handleUpdateRole}
          onDelete={handleDeleteRoleModal}
          onAssignUsers={handleAssignUsers}
        />
      )}
    </>
  );
};

export default RoleMainArea;