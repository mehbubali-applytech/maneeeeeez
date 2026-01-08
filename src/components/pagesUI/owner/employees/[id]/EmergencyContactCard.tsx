// components/employee/EmergencyContactCard.tsx
"use client";

import React from 'react';
import { IEmployee } from '../EmployeeTypes';
import { Phone, Mail, MapPin, User, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';

interface EmergencyContactCardProps {
  employee: IEmployee;
  onEdit?: () => void;
}

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({ 
  employee, 
  onEdit 
}) => {
  const contact = {
    name: employee.emergencyContactName,
    relationship: employee.emergencyContactRelation,
    phone: employee.emergencyContactPhone
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
              <p className="text-sm text-gray-500">Primary contact for emergencies</p>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Contact"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>

        {contact.name ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-red-50/50 rounded-lg border border-red-100">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {contact.relationship} • Primary Contact
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Link 
                      href={`tel:${contact.phone}`}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      {contact.phone}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Call immediately in case of emergency
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Contacts Placeholder */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Additional Contacts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contact {i}</p>
                        <p className="text-xs text-gray-500">Add additional contact</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Contact</h4>
            <p className="text-gray-500 mb-4">Add an emergency contact for this employee</p>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContactCard;