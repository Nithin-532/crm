import { z } from "zod";

const ClientFormSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    number: z.string({
        required_error: "Number is required",
        invalid_type_error: "Number must be a string",
    }).length(13, { message: "Number must be 10 characters long with including the country code, Example: +910000000000" }),
    company: z.string({
        required_error: "Company is required",
        invalid_type_error: "Company must be a string",
    }),
    status: z.number({
        required_error: "Status is required",
        invalid_type_error: "Status must be a string",
    }),
    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    }),
})

export const ClientApiSchema = ClientFormSchema.extend({
    memberId: z.number({
        required_error: "Member ID is required for API submission",
        invalid_type_error: "Member ID must be a string",
    })
});

export type ClientApiType = z.infer<typeof ClientApiSchema>;
export type ClientFormType = z.infer<typeof ClientFormSchema>