"use client";
import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const SubscriptionPlan = () => {
  const [value, setValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModules, setSelectedModules] = useState<string[]>(["CRM", "HR"]);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("America/New_York");

  const moduleOptions = [
    "CRM",
    "HR",
    "Projects",
    "Payroll",
    "Inventory",
    "Finance",
    "Support",
  ];

  const planOptions = [
    { 
      value: "free", 
      label: "Free", 
      price: 0,
      limits: "Up to 5 users, Basic Support",
      features: ["5 Users Max", "Basic Modules", "Email Support", "1GB Storage"]
    },
    { 
      value: "basic", 
      label: "Basic", 
      price: 29,
      limits: "Up to 25 users, Standard Support",
      features: ["25 Users", "All Modules", "Priority Support", "10GB Storage", "Basic Analytics"]
    },
    { 
      value: "pro", 
      label: "Pro", 
      price: 79,
      limits: "Unlimited users, Priority Support",
      features: ["Unlimited Users", "All Modules", "Priority Support", "100GB Storage", "Advanced Analytics", "Custom Reports", "API Access"]
    },
    { 
      value: "enterprise", 
      label: "Enterprise", 
      price: 199,
      limits: "Custom limit, Dedicated Support",
      features: ["Unlimited Users", "All Modules", "24/7 Dedicated Support", "1TB Storage", "Advanced Analytics", "Custom Reports", "API Access", "Custom Integrations", "Personal Account Manager"]
    },
  ];

  const timezoneList = [
    "Asia/Kolkata",
    "America/New_York",
    "Europe/London",
    "Asia/Dubai",
  ];

  const currencyList = [
    "INR",
    "USD",
    "GBP",
    "AED",
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsLoading(true);
    setValue(newValue);
    
    // Simulate a slight delay for content update
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleModuleToggle = (module: string) => {
    setSelectedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handlePlanSelect = (planValue: string) => {
    setSelectedPlan(planValue);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      "INR": "₹",
      "USD": "$",
      "GBP": "£",
      "AED": "د.إ"
    };
    return symbols[currency] || currency;
  };

  const getSelectedPlan = () => {
    return planOptions.find(plan => plan.value === selectedPlan) || planOptions[0];
  };

  return (
    <div className="card__wrapper card-tab-wrapper">
      <div className="card__title-wrap flex flex-wrap gap-[10px] items-center justify-between mb-[25px]">
        <h5 className="card__heading-title">Subscription Plan</h5>
        <div className="card__tab">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Plans" />
            <Tab label="Modules" />
            <Tab label="Settings" />
          </Tabs>
        </div>
      </div>
      
      <div className="tab-content">
        {isLoading ? (
          <div className="loading-spinner flex justify-center items-center py-8">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Plans Tab */}
            <div hidden={value !== 0}>
              {value === 0 && (
                <div className="card__box-wrapp">
                  <h6 className="card__sub-title mb-[15px]">Choose Your Plan</h6>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {planOptions.map((plan) => (
                      <div
                        key={plan.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handlePlanSelect(plan.value)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{plan.label}</h4>
                            <p className="text-sm text-gray-600">{plan.limits}</p>
                          </div>
                          {selectedPlan === plan.value && (
                            <CheckCircleIcon className="text-green-500" />
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold">
                              {plan.price === 0 ? "Free" : `${getCurrencySymbol(selectedCurrency)}${plan.price}`}
                            </span>
                            {plan.price > 0 && (
                              <span className="text-gray-500 ml-1">/month</span>
                            )}
                          </div>
                        </div>
                        
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircleIcon className="text-green-500 mr-2" style={{ fontSize: 16 }} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          className={`mt-4 w-full py-2 rounded-md transition-colors ${
                            selectedPlan === plan.value
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          onClick={() => handlePlanSelect(plan.value)}
                        >
                          {selectedPlan === plan.value ? "Selected" : "Select Plan"}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Selected Plan:</span>
                      <span className="font-semibold">{getSelectedPlan().label}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Price:</span>
                      <span className="font-semibold">
                        {getSelectedPlan().price === 0 
                          ? "Free" 
                          : `${getCurrencySymbol(selectedCurrency)}${getSelectedPlan().price}/month`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Billing Cycle:</span>
                      <span className="font-semibold">Monthly</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modules Tab */}
            <div hidden={value !== 1}>
              {value === 1 && (
                <div className="card__box-wrapp">
                  <h6 className="card__sub-title mb-[15px]">Select Modules</h6>
                  <p className="text-gray-600 mb-4">Choose the modules you want to activate in your plan.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                    {moduleOptions.map((module) => (
                      <div
                        key={module}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedModules.includes(module)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleModuleToggle(module)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{module}</span>
                          {selectedModules.includes(module) ? (
                            <CheckCircleIcon className="text-green-500" />
                          ) : (
                            <CancelIcon className="text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedModules.includes(module) 
                            ? "Active in your plan" 
                            : "Click to activate"
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Selected Modules ({selectedModules.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModules.map((module) => (
                        <span
                          key={module}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings Tab */}
            <div hidden={value !== 2}>
              {value === 2 && (
                <div className="card__box-wrapp">
                  <h6 className="card__sub-title mb-[15px]">Plan Settings</h6>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                      >
                        {currencyList.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency} ({getCurrencySymbol(currency)})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedTimezone}
                        onChange={(e) => setSelectedTimezone(e.target.value)}
                      >
                        {timezoneList.map((timezone) => (
                          <option key={timezone} value={timezone}>
                            {timezone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Current Configuration</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{getSelectedPlan().label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Modules:</span>
                        <span className="font-medium">{selectedModules.length} modules</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{selectedCurrency} ({getCurrencySymbol(selectedCurrency)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-medium">{selectedTimezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Cost:</span>
                        <span className="font-semibold text-lg">
                          {getSelectedPlan().price === 0 
                            ? "Free" 
                            : `${getCurrencySymbol(selectedCurrency)}${getSelectedPlan().price}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Update Subscription
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;