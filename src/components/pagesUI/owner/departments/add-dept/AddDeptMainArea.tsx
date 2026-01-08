"use client";

import Link from "next/link";
import React, { useState } from "react";
import { 
  FormControlLabel, 
  Switch,
  Autocomplete,
  TextField
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { IDepartment } from "../DepartmentTypes";
import InputField from "@/components/elements/SharedInputs/InputField";

const AddDeptMainArea: React.FC = () => {
    const router = useRouter();
    const [status, setStatus] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<IDepartment>();

    const departmentList = [
        {
            id: 1,
            name: "HR",
            departmentCode: "HR01",
            subDepartments: [
                { id: 3, name: "Recruitment", departmentCode: "HR01-1" },
                { id: 4, name: "Employee Relations", departmentCode: "HR01-2" },
            ],
        },
        {
            id: 2,
            name: "IT",
            departmentCode: "IT01",
            subDepartments: [
                { id: 5, name: "Infrastructure", departmentCode: "IT01-1" },
                { id: 6, name: "Software Development", departmentCode: "IT01-2" },
            ],
        },
        {
            id: 7,
            name: "Finance",
            departmentCode: "FIN01",
            subDepartments: [
                { id: 8, name: "Accounts Payable", departmentCode: "FIN01-1" },
                { id: 9, name: "Accounts Receivable", departmentCode: "FIN01-2" },
            ],
        },
        {
            id: 10,
            name: "Marketing",
            departmentCode: "MKT01",
            subDepartments: [
                { id: 11, name: "Digital Marketing", departmentCode: "MKT01-1" },
                { id: 12, name: "Content Creation", departmentCode: "MKT01-2" },
            ],
        },
    ];

    // Flatten departments + sub-departments for autocomplete
    const autocompleteOptions = [
        ...departmentList.map((dep) => ({
            id: dep.id,
            label: `${dep.name} (${dep.departmentCode})`,
            isMain: true,
            originalName: dep.name,
        })),
        ...departmentList.flatMap(dep =>
            dep.subDepartments.map(sub => ({
                id: sub.id,
                label: `${dep.name} → ${sub.name} (${sub.departmentCode})`,
                isMain: false,
                parentName: dep.name,
                originalName: sub.name,
            }))
        )
    ];

    const handleStatusChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setStatus(event.target.checked);
    };

    const onSubmit = (data: IDepartment) => {
        const payload: IDepartment = {
            ...data,
            id: Date.now(),
            created_at: new Date().toISOString(),
            status: status ? "Active" : "Inactive",
        };

        console.log("Payload:", payload);

        toast.success("Department added successfully!");
        setTimeout(() => {
            router.push("/owner/departments");
        }, 500);
    };

    return (
        <div className="app__slide-wrapper">
            {/* Breadcrumb */}
            <div className="breadcrumb__wrapper mb-[25px]">
                <nav>
                    <ol className="breadcrumb flex items-center mb-0">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/owner">Owner</Link>
                        </li>
                        <li className="breadcrumb-item active">Add Department</li>
                    </ol>
                </nav>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Add New Department</h1>
                <p className="text-gray-600 mt-2">Create a new department or sub-department in your organization</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Department Details</h2>
                            <p className="text-gray-600 text-sm">Enter department information carefully</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-8">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Department Name */}
                            <div className="col-span-12 lg:col-span-6">
                                <InputField
                                    id="name"
                                    label="Department Name"
                                    required
                                    register={register("name", {
                                        required: "Department name is required"
                                    })}
                                />
                              
                            </div>

                            {/* Department Code */}
                            <div className="col-span-12 lg:col-span-6">
                                <InputField
                                    id="departmentCode"
                                    label="Department Code"
                                    required
                                    register={register("departmentCode", {
                                        required: "Department code is required",
                                    })}
                                />
                            
                            </div>

                            {/* Department Head */}
                            <div className="col-span-12 lg:col-span-6">
                                <InputField
                                    id="head"
                                    label="Department Head"
                                    register={register("head")}
                                />
                            </div>

                            {/* Parent Department - Autocomplete */}
                            <div className="col-span-12 lg:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Department
                                    <span className="text-gray-500 text-sm ml-1">(Optional)</span>
                                </label>
                                <Controller
                                    name="parentDepartmentId"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            value={autocompleteOptions.find(option => option.id === field.value) || null}
                                            onChange={(event, newValue) => {
                                                field.onChange(newValue ? newValue.id : null);
                                            }}
                                            options={autocompleteOptions}
                                            groupBy={(option) => option.isMain ? "Main Departments" : "Sub-Departments"}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Search or select from list"
                                                    size="small"
                                                />
                                            )}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            fullWidth
                                            clearOnBlur
                                            clearOnEscape
                                            blurOnSelect
                                        />
                                    )}
                                />
                                <p className="text-gray-500 text-sm mt-2">
                                    Leave empty if this is a main department
                                </p>
                            </div>

                            {/* Contact Information Section */}
                            <div className="col-span-12 mt-6 mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-0.5 bg-primary mr-3"></div>
                                    <h3 className="text-lg font-medium text-gray-700">Contact Information</h3>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                <InputField
                                    id="phone"
                                    label="Phone Number"
                                    register={register("phone")}
                                    type="tel"
                                />
                            </div>

                            {/* Email */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-8">
                                <InputField
                                    id="email"
                                    label="Email Address"
                                    register={register("email")}
                                    type="email"
                                />
                            </div>

                            {/* Description */}
                            <div className="col-span-12">
                                <InputField
                                    id="description"
                                    label="Description"
                                    register={register("description")}
                                    isTextArea={true}
                                />
                                <p className="text-gray-500 text-sm mt-2">
                                    Optional: Describe the department&apos;s main functions and responsibilities
                                </p>
                            </div>

                            {/* Status */}
                            <div className="col-span-12 mt-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Department Status</h4>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {status
                                                    ? "This department will be active and operational"
                                                    : "This department will be inactive and hidden"}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`mr-3 font-medium ${status ? 'text-green-600' : 'text-gray-600'}`}>
                                                {status ? 'Active' : 'Inactive'}
                                            </span>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={status}
                                                        onChange={handleStatusChange}
                                                        color="primary"
                                                        size="medium"
                                                    />
                                                }
                                                label=""
                                            />
                                        </div>
                                    </div>
                                    <div className={`mt-4 px-4 py-3 rounded-md ${status ? 'bg-green-50 border border-green-200' : 'bg-gray-100 border border-gray-200'}`}>
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            <span className={`text-sm ${status ? 'text-green-700' : 'text-gray-600'}`}>
                                                {status
                                                    ? '✓ Department is operational and will appear in all listings.'
                                                    : '✗ Department is disabled and will not appear in listings.'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-10 pt-8 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push("/owner/departments")}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Department
                                </div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Quick Tips */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="font-medium text-blue-800">Department Creation Guidelines</h4>
                        <ul className="mt-2 text-blue-700 text-sm space-y-1">
                            <li>• Use consistent naming conventions (e.g., HR, IT, Finance)</li>
                            <li>• Department codes should be unique and follow your organization&apos;s pattern</li>
                            <li>• Parent department is optional - use for creating sub-departments</li>
                            <li>• Active departments will be immediately available in the system</li>
                            <li>• You can add team members to departments after creation</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Available Departments Preview */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Available Departments</h3>
                    <span className="text-sm text-gray-500">{departmentList.length} main departments</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departmentList.map((dept) => (
                        <div key={dept.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-800">{dept.name}</span>
                                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{dept.departmentCode}</span>
                            </div>
                            {dept.subDepartments.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-1">Sub-departments:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {dept.subDepartments.map((sub) => (
                                            <span key={sub.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {sub.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddDeptMainArea;