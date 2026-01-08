"use client"
import CustomDropdown from '@/components/dropdown/CustomDropdown';
import { dropdownItems } from '@/data/dropdown-data';
import { Button, Tab, Tabs } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CompanyQuickAccess = () => {
    const [value, setValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
      const params = useParams();
      const id = Number(params?.id)||1;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIsLoading(true);
        setValue(newValue);

        // Simulate a slight delay for content update
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    const handleStaffClick = ()=>{
        router.push(`/super-admin/staff/${id}`)
    }

      const handleHRClick = ()=>{
        router.push(`/super-admin/hr-manager/${id}`)
    }
       const handleEmployeeClick = ()=>{
        router.push(`/super-admin/employees/${id}`)
    }

      const handleComplianceClick = ()=>{
        router.push(`/super-admin/compliance-officers/${id}`)
    }
       const handleFinanceClick = ()=>{
        router.push(`/super-admin/finance-executives/${id}`)
    }
    return (
        <>
            <div className="card__wrapper no-height mb-4 flex items-center gap-4">
                <Button variant="contained" color="primary" className="!text-white mr-2" onClick={handleStaffClick}>
                    Staff
                </Button>
                <Button variant="contained" color="secondary" className="!text-white mr-2"  onClick={handleHRClick}>
                    HR
                </Button>
                <Button variant="contained" color="warning" className="!text-white mr-2" onClick={handleEmployeeClick}>
                    Employee
                </Button>
                <Button variant="contained" color="success" className="!text-white" onClick={handleComplianceClick}>
                    Complance Officer
                </Button>
                  <Button variant="contained" color="info" className="!text-white" onClick={handleFinanceClick}>
                    Finance Executive
                </Button>

            </div>
        </>
    );
};

export default CompanyQuickAccess;