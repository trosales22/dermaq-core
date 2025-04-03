import { z } from "zod";

export const productSchema = z.object({
    code: z.string().nonempty('Code is required'),
    name: z.string().nonempty('Name is required'),
    description: z.string().nonempty('Description is required'),
    photo_url: z.string().url("Invalid image URL").nullable().optional(),
    photo_gallery: z
        .array(z.string().url("Invalid image URL"))
        .max(10, "You can upload a maximum of 10 images")
        .nullable()
        .optional(),
    price: z.coerce.number().positive("Price must be a positive number"),
    quantity: z.coerce.number().positive("Quantity must be a positive number"),
});

export type ProductFormData = z.infer<typeof productSchema>;
