"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  console.log(data);

  await fs.mkdir("public/products", { recursive: true });

  const imagePath = `products/${crypto.randomUUID()}-${data.image.name}`;
  const arrayBuffer = await data.image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log("Attempting to write file at path:", `public/${imagePath}`);

  const bufferData: Uint8Array = new Uint8Array(buffer);

  await fs.writeFile(`public/${imagePath}`, bufferData);
  console.log("File written successfully");

  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      imagePath,
    },
  });
}
