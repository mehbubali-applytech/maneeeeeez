"use client";
import React from "react";

export interface StepItem {
  step: number;
  title: string;
  icon: string;
}

interface Props {
  steps: StepItem[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

const BoxStepWithIcon: React.FC<Props> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  return (
    <div className={`steps-grid-${steps.length}`}>
      {steps.map((item) => (
        <div
          key={item.step}
          className={`steps-item ${
            currentStep === item.step ? "current" : ""
          }`}
        >
          <span className="steps-number">
            <i className={item.icon}></i>
          </span>

          <div
            onClick={() => onStepChange(item.step)}
            className="steps-content cursor-pointer"
          >
            <span className="steps-title">{item.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoxStepWithIcon;
