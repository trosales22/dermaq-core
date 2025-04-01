import { z } from "zod";

export const clinicSessionSchema = z.object({
  session_date: z.string().nonempty("Session Date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  start_time: z.string().nonempty("Start Time is required").regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid start time format (HH:mm)"),
  end_time: z.string().nonempty("End Time is required").regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid end time format (HH:mm)"),
  max_slots: z
    .number({ invalid_type_error: "Max slots must be a number" })
    .min(1, "At least 1 slot is required"),
  status: z.enum([
      "open", "closed", "cancelled"
  ]).optional().nullable(),
});

export type ClinicSessionFormData = z.infer<typeof clinicSessionSchema>;
