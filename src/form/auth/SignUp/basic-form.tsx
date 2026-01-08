"use client";

import ErrorMessage from "@/components/error-message/ErrorMessage";
import { ISignUpForm } from "@/interface";
import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUpBasicForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ISignUpForm>();

    useEffect(() => {
        const designation = localStorage.getItem("designation");
        if (designation) {
            if (designation === "Super Administrator") {
                router.push("/super-admin");
            } else if (designation === "Project Manager") {
                router.push("/owner");
            }
        }
    }, [router]);

    const onSubmit = async (data: ISignUpForm) => {
        try {
            console.log("Form Data Submitted:", data);
            const response = await axios.post("https://payroll-baas.onrender.com/api/auth/login", data);
            toast.success("Sign Up successfully");
            console.log("Server Response:", response.data);
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("designation", response.data.data.employee.info.designation);

            if (response.data.data.employee.info.designation === "Super Administrator") {
                router.push("/super-admin");
            } else if (response.data.data.employee.info.designation === "Project Manager") {
                router.push("/owner");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className="from__input-box">
                <div className="form__input-title">
                    <label htmlFor="nameEmail">Username</label>
                </div>
                <div className="form__input">
                    <input
                        className="form-control"
                        id="nameEmail"
                        type="text"
                        {...register("username", { required: "Username is required" })}
                    />
                    <ErrorMessage error={errors.username} />
                </div>
            </div>

            {/* Password */}
            <div className="from__input-box">
                <div className="form__input-title flex justify-between">
                    <label htmlFor="passwordInput">Password</label>
                    <Link href="/auth/auth-forgot-password-basic">
                        <small>Forgot Password?</small>
                    </Link>
                </div>
                <div className="form__input">
                    <input
                        className="form-control"
                        type={isPasswordVisible ? "text" : "password"}
                        id="passwordInput"
                        {...register("password", { required: "Password is required" })}
                    />
                    <ErrorMessage error={errors.password} />
                    <div className="pass-icon" onClick={togglePasswordVisibility}>
                        <i
                            className={`fa-sharp fa-light ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* Remember Me */}
            <div className="mb-4">
                <FormControlLabel
                    control={
                        <Checkbox
                            className="custom-checkbox"
                            {...register("rememberMe")}
                        />
                    }
                    label="Remember Me"
                />
            </div>

            {/* Submit */}
            <div className="mb-4">
                <button className="btn btn-primary w-full" type="submit">
                    Sign Up
                </button>
            </div>
        </form>
    );
};

export default SignUpBasicForm;
