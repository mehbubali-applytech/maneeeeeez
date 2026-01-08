// "use client";

// import React, { useEffect, useState } from "react";
// import { Dialog, DialogTitle, DialogContent } from "@mui/material";
// import CompanyInformationForm from "./CompanyInformationForm";
// import CompanyAddress from "./CompanyAddress";
// import SocialMedai from "./SocialMediai";
// import Access from "./Access";
// // NOTE: import ICompany from local file to keep types consistent
// import { ICompany } from "./CompaniesMainArea";
// import { useForm } from "react-hook-form";

// interface AddCompanyModalProps {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   editData?: ICompany | null;
//   onSave?: (payload: ICompany) => void; // callback to parent
// }

// const AddNewCompanyModal: React.FC<AddCompanyModalProps> = ({
//   open,
//   setOpen,
//   editData = null,
//   onSave,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm<ICompany>({
//     defaultValues: editData || ({} as ICompany),
//   });

//   // whenever editData changes, reset form with values
//   useEffect(() => {
//     if (editData) {
//       reset(editData);
//     } else {
//       reset({});
//     }
//   }, [editData, reset]);

//   const onSubmit = async (data: ICompany) => {
//     // if editData exists, this acts as update
//     // Replace below with API call and proper error handling
//     if (editData) {
//       const payload = { ...editData, ...data };
//       console.log("Updating company:", payload);
//       if (onSave) onSave(payload);
//     } else {
//       const payload = { ...data };
//       console.log("Creating company:", payload);
//       if (onSave) onSave(payload);
//     }
//     // close modal
//     setOpen(false);
//   };

//   const handleToggle = () => setOpen((v) => !v);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const steps = [
//     { label: "Company Information" },
//     { label: "Company Address" },
//     { label: "Social Media" },
//     { label: "Access" },
//   ];

//   const renderStepContent = (index: number) => {
//     switch (index) {
//       case 0:
//         return (
//           <CompanyInformationForm
//             register={register}
//             errors={errors}
//             control={control}
//           />
//         );
//       case 1:
//         return <CompanyAddress register={register} errors={errors} />;
//       case 2:
//         return <SocialMedai register={register} errors={errors} />;
//       case 3:
//         return <Access register={register} errors={errors} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
//       <DialogTitle>
//         <div className="flex justify-between">
//           <h5 className="modal-title">{editData ? "Edit Company" : "Add New Company"}</h5>
//           <button onClick={handleToggle} type="button" className="bd-btn-close">
//             <i className="fa-solid fa-xmark-large"></i>
//           </button>
//         </div>
//       </DialogTitle>

//       <DialogContent className="common-scrollbar overflow-y-auto">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="card__wrapper">
//             <div className="steps__form mb-[20px]">
//               <div className="steps__row style_two setup-panel-2 flex flex-wrap justify-start md:justify-between gap-4 ">
//                 {steps.map((step, index) => (
//                   <div className="steps__step" key={index}>
//                     <button
//                       onClick={() => setActiveIndex(index)}
//                       type="button"
//                       className={`steps__title ${activeIndex === index ? "step-active" : ""}`}
//                     >
//                       {step.label}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="step-content mt-[20px]">{renderStepContent(activeIndex)}</div>

//             <div className="flex gap-[20px] flex-wrap justify-between items-center mt-[20px]">
//               {activeIndex !== 0 && (
//                 <button
//                   type="button"
//                   className="prevBtn-2 btn btn-secondary"
//                   onClick={() => setActiveIndex(Math.max(activeIndex - 1, 0))}
//                   disabled={activeIndex === 0}
//                 >
//                   Previous
//                 </button>
//               )}

//               {steps.length - 1 !== activeIndex ? (
//                 <button
//                   type="button"
//                   className="nextBtn-2 btn btn-primary"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setActiveIndex(Math.min(activeIndex + 1, steps.length - 1));
//                   }}
//                 >
//                   Next
//                 </button>

//               ) : (
//                 <button type="submit" className="btn btn-primary">
//                   {editData ? "Update" : "Submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddNewCompanyModal;
