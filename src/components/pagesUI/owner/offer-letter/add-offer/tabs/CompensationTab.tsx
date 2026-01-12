"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  TextField,
  Button,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import InputField from "@/components/elements/SharedInputs/InputField";

/* ================= TYPES ================= */

type BenefitItem = {
  id: string;
  label: string;
};

type OfferLetterFormValues = {
  baseSalary: number;
  bonus: number;
  ctc: number;
  equity?: number;
  benefits: BenefitItem[];
};

/* ================= COMPONENT ================= */

const CompensationTab: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<OfferLetterFormValues>();

  const [newBenefit, setNewBenefit] = useState("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  /* ================= WATCH ================= */

  const baseSalary = watch("baseSalary") || 0;
  const bonus = watch("bonus") || 0;
  const ctc = watch("ctc") || 0;

  const otherComponents = ctc - baseSalary - bonus;

  /* ================= EFFECT ================= */

  useEffect(() => {
    setValue("ctc", baseSalary + bonus);
  }, [baseSalary, bonus, setValue]);

  /* ================= HELPERS ================= */

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;

    append({
      id: crypto.randomUUID(),
      label: newBenefit.trim(),
    });

    setNewBenefit("");
  };

  const commonBenefits = [
    "Health Insurance",
    "Provident Fund (PF)",
    "Gratuity",
    "Employee State Insurance (ESIC)",
    "Accident Insurance",
    "Paid Time Off",
    "Flexible Work Hours",
    "Work From Home",
    "Learning & Development",
    "Meal Vouchers",
    "Gym Membership",
    "Transport Allowance",
    "Performance Bonus",
    "Stock Options",
    "Retirement Benefits",
  ];

  /* ================= RENDER ================= */

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Compensation Package
      </Typography>

      <Grid container spacing={3}>
        {/* Salary Components */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Salary Structure
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="baseSalary"
            control={control}
            rules={{
              required: "Base salary is required",
              min: { value: 0, message: "Salary must be positive" },
            }}
            render={() => (
              <InputField
                id="baseSalary"
                label="Base Salary (Annual)"
                type="number"
                groupInput
                groupText="₹"
                register={register("baseSalary", {
                  required: "Base salary is required",
                  valueAsNumber: true,
                })}
                error={errors.baseSalary}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="bonus"
            control={control}
            rules={{ min: { value: 0, message: "Bonus must be positive" } }}
            render={() => (
              <InputField
                id="bonus"
                label="Annual Bonus"
                type="number"
                groupInput
                groupText="₹"
                register={register("bonus", { valueAsNumber: true })}
                error={errors.bonus}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="ctc"
            control={control}
            rules={{
              required: "CTC is required",
              min: {
                value: baseSalary + bonus,
                message: "CTC must be at least base + bonus",
              },
            }}
            render={() => (
              <InputField
                id="ctc"
                label="Cost to Company (CTC)"
                type="number"
                groupInput
                groupText="₹"
                register={register("ctc", { valueAsNumber: true })}
                error={errors.ctc}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="equity"
            control={control}
            render={() => (
              <InputField
                id="equity"
                label="Equity / Stock Options"
                type="number"
                register={register("equity", { valueAsNumber: true })}
                error={errors.equity}
              />
            )}
          />
        </Grid>

        {/* Salary Breakdown */}
        <Grid item xs={12}>
          <Box sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Salary Breakdown
            </Typography>

            <Box mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Base Salary:</Typography>
                <Typography>{formatCurrency(baseSalary)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Annual Bonus:</Typography>
                <Typography>{formatCurrency(bonus)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Other Components:</Typography>
                <Typography>{formatCurrency(otherComponents)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={600}>Total CTC:</Typography>
                <Typography fontWeight={600} color="primary">
                  {formatCurrency(ctc)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption" color="text.secondary">
                  Monthly Gross:
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {formatCurrency(ctc / 12)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Benefits */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ color: "text.secondary", mt: 3, mb: 2 }}
          >
            Benefits & Perks
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Enter benefit"
              size="small"
              fullWidth
              onKeyDown={(e) => e.key === "Enter" && handleAddBenefit()}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddBenefit}
              disabled={!newBenefit.trim()}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {commonBenefits.slice(0, 6).map((benefit) => (
              <Chip
                key={benefit}
                label={benefit}
                size="small"
                variant="outlined"
                onClick={() =>
                  append({
                    id: crypto.randomUUID(),
                    label: benefit,
                  })
                }
              />
            ))}
          </Box>

          {fields.length > 0 ? (
            fields.map((benefit, index) => (
              <ListItem
                key={benefit.id}
                secondaryAction={
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText primary={benefit.label} />
              </ListItem>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
              <Typography color="text.secondary">
                No benefits added yet. Add common benefits like Health Insurance,
                PF, etc.
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Compensation Notes */}
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: "info.50", borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: "info.dark" }}>
              <strong>💡 Note:</strong> The CTC includes all monetary components.
              Non-monetary benefits (like flexible hours) are listed separately.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompensationTab;
