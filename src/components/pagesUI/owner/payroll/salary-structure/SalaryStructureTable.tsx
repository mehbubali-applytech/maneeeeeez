"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ISalaryField } from "./SalaryStructureField";
import { Edit2, Plus, Save, X, Trash2 } from "lucide-react";

interface Props {
    fields: ISalaryField[];
    onSave?: (updated: ISalaryField[]) => void;
}

interface FormValues {
    fields: ISalaryField[];
}

const SalaryStructureTable: React.FC<Props> = ({ fields, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localFields, setLocalFields] = useState<ISalaryField[]>(fields);

    const { register, handleSubmit, control, reset } = useForm<FormValues>({
        defaultValues: { fields: localFields },
    });

    const { fields: formFields, append, remove } = useFieldArray({
        control,
        name: "fields",
    });

    // Total salary
    const totalSalary = formFields.reduce((sum, field) => {
        const value = parseFloat(field.value?.toString() || "0");
        return sum + (isNaN(value) ? 0 : value);
    }, 0);

    // Sync form values
    useEffect(() => {
        reset({ fields: localFields });
    }, [localFields, reset]);

    useEffect(() => {
        if (!isEditing) {
            setLocalFields(fields);
        }
    }, [fields, isEditing]);

    const onSubmit = (data: FormValues) => {
        onSave?.(data.fields);
        setLocalFields(data.fields);
        setIsEditing(false);
    };

    const handleAddField = () => {
        if (!isEditing) handleEdit();
        append({ id: crypto.randomUUID(), label: "", value: 0 });
    };

    const handleEdit = () => {
        setIsEditing(true);
        reset({ fields: localFields });
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset({ fields: localFields });
    };

    return (
        <div className="card__wrapper bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-shadow duration-200">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-3">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Salary Structure</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage salary components</p>
                    </div>

                    {isEditing ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="font-medium">Editing Mode</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100 hover:border-blue-200"
                        >
                            <Edit2 size={16} />
                            <span className="font-medium">Edit Structure</span>
                        </button>
                    )}
                </div>

                {/* Salary Fields */}
                <div className="space-y-4 mb-6">
                    {formFields.map((field, index) => (
                        <div
                            key={field.id}
                            className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-lg transition-all duration-200 ${isEditing ? "bg-blue-50 border border-blue-100 hover:bg-blue-100" : "hover:bg-gray-50"
                                }`}
                        >
                            {/* Component Name */}
                            <div className="sm:col-span-5">
                                {isEditing && (
                                    <label className="form-label text-gray-700 font-medium text-sm mb-1.5 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Component Name
                                    </label>
                                )}
                                <input
                                    type="text"
                                    {...register(`fields.${index}.label`, {
                                        required: isEditing && "Component name is required",
                                    })}
                                    className={`w-full ${isEditing
                                            ? "form-control pl-3 pr-3 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md transition-all"
                                            : "bg-transparent text-lg sm:text-base font-semibold text-gray-800 border-none p-0 focus:outline-none"
                                        }`}
                                    placeholder={isEditing ? "Enter component name" : ""}
                                    readOnly={!isEditing}
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Amount */}
                            <div className="sm:col-span-5">
                                {isEditing ? (
                                    <>
                                        <label className="form-label text-gray-700 font-medium text-sm mb-1.5">
                                            Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            {...register(`fields.${index}.value`, {
                                                valueAsNumber: true,
                                                required: isEditing && "Amount is required",
                                                min: { value: 0, message: "Amount must be positive" },
                                            })}
                                            className="form-control w-full pl-3 pr-3 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md transition-all text-right"
                                            placeholder="0.00"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full text-xl sm:text-lg font-bold text-gray-900 text-right">
                                        ₹{field.value.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Delete Button */}
                            {isEditing && formFields.length > 1 && (
                                <div className="sm:col-span-2 flex justify-end mt-2 sm:mt-0">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                        title="Remove component"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Total Salary */}
                <div className="mb-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg gap-3">
                        <div>
                            <h4 className="font-bold text-gray-700 text-lg">Total Monthly Salary</h4>
                            <p className="text-gray-500 text-sm">Sum of all components</p>
                        </div>
                        <div className="text-right text-2xl sm:text-3xl font-bold text-gray-900">
                            ₹{totalSalary.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleAddField}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 ${isEditing
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <Plus size={18} />
                        <span className="font-medium">Add Component</span>
                    </button>

                    {isEditing ? (
                        <div className="flex gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                <X size={18} />
                                <span className="font-medium">Cancel</span>
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <Save size={18} />
                                <span className="font-medium">Save Changes</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                            {formFields.length} component{formFields.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                {/* Edit Mode Info */}
                {isEditing && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                        💡 You can now modify all fields. Click &quot;Save Changes&quot; to apply updates or &quot;Cancel&quot; to discard.
                    </div>

                )}
            </form>
        </div>
    );
};

export default SalaryStructureTable;
