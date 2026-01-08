import { Checkbox, FormControlLabel, Switch } from "@mui/material";
import React from "react";

interface CardProps {
  iconClass: string; // Font Awesome icon class
  title: string; // Title of the card
  description: string; // Optional description
  isSelected?: boolean; // Indicates if the change is positive or negative
}

const SubscriptionSingleCard: React.FC<CardProps> = ({
  iconClass,
  title,
  description,
  isSelected,
}) => {
  return (
    <div className="card__wrapper flex justify-between p-5 mb-5 items-center">
      <div className="flex items-center gap-[30px] maxSm:gap-5">
        <div className="card__icon">
          <span>
            <i className={iconClass}></i>
          </span>
        </div>
        <div className="card__title-wrap">
          <h3 className="card__sub-title mb-[10px]">{title}</h3>
          <div className="flex flex-wrap items-end gap-[10px]">
            {/* <h3 className="card__title mb-0">{value}</h3> */}
            <p className="text-muted mb-0">{description}</p>
          </div>
        </div>
      </div>
      <Switch defaultChecked />
    </div>
  );
};

export default SubscriptionSingleCard;
