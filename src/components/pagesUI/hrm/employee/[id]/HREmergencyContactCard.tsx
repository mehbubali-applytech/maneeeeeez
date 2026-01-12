// HREmergencyContactCard.tsx
"use client";

import React from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  Phone, Mail, Users, Shield, AlertCircle,
  Home, Heart, Briefcase, UserPlus
} from 'lucide-react';

interface HREmergencyContactCardProps {
  employee: IHREmployee;
  onEdit?: () => void;
  onAddContact?: () => void;
}

const HREmergencyContactCard: React.FC<HREmergencyContactCardProps> = ({ 
  employee, 
  onEdit,
  onAddContact
}) => {
  const emergencyContact = {
    name: employee.emergencyContactName,
    relationship: employee.emergencyContactRelation,
    phone: employee.emergencyContactPhone
  };

  // Mock additional contacts
  const additionalContacts = [
    {
      id: 1,
      name: 'Suresh Kumar',
      relationship: 'Father',
      phone: '+91 9876543210',
      priority: 'Secondary'
    },
    {
      id: 2,
      name: 'Neha Sharma',
      relationship: 'Spouse',
      phone: '+91 9876543211',
      priority: 'Secondary'
    }
  ];

  const getRelationshipIcon = (relationship: string) => {
    switch(relationship.toLowerCase()) {
      case 'spouse':
      case 'wife':
      case 'husband':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'father':
      case 'mother':
      case 'parent':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'brother':
      case 'sister':
      case 'sibling':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'friend':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
              <p className="text-sm text-gray-500">HR emergency contact management</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {onAddContact && (
              <button
                onClick={onAddContact}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Add Contact"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit Contacts"
              >
                <i className="fa-regular fa-pen-to-square text-lg"></i>
              </button>
            )}
          </div>
        </div>

        {/* Primary Emergency Contact */}
        {emergencyContact.name ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-red-800 uppercase tracking-wider">
                  Primary Emergency Contact
                </span>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    {getRelationshipIcon(emergencyContact.relationship)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{emergencyContact.name}</h4>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {emergencyContact.relationship}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Phone:</span>
                      </div>
                      <a 
                        href={`tel:${emergencyContact.phone}`}
                        className="text-red-600 hover:text-red-800 font-medium text-lg"
                      >
                        {emergencyContact.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Priority:</span>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                        Highest Priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Contact immediately in case of emergency. Available 24/7.
                </p>
              </div>
            </div>

            {/* Additional Contacts */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Additional Contacts
              </h4>
              <div className="space-y-3">
                {additionalContacts.map((contact) => (
                  <div key={contact.id} className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          {getRelationshipIcon(contact.relationship)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            {contact.relationship} • {contact.priority}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                ))}
                
                {onAddContact && (
                  <button
                    onClick={onAddContact}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 font-medium">Add Another Contact</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Contacts</h4>
            <p className="text-gray-500 mb-6">Add emergency contacts for this employee</p>
            {onAddContact && (
              <button
                onClick={onAddContact}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <UserPlus className="w-4 h-4" />
                Add Emergency Contact
              </button>
            )}
          </div>
        )}

        {/* HR Notes */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            HR Notes
          </h4>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Note:</span> Ensure emergency contacts are verified annually and updated immediately upon employee request.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Last verified: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HREmergencyContactCard;