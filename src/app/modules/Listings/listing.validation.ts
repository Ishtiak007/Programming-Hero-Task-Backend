import { z } from 'zod';

const createListingValidationSchema = z.object({
  body: z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    price: z.number(),
    date: z.coerce.date().optional(),
    // condition: z.enum(['new', 'likeNew', 'used', 'refurbished']),
    images: z.array(z.string()),
    userID: z.string().optional(),
    status: z.enum(['available', 'sold']).default('sold'),
    category: z.enum([
      'wedding',
      'birthday',
      'corporate',
      'concert',
      'conference',
      'festival',
      'babyShower',
      'engagement',
      'anniversary',
      'productLaunch',
    ]),
    // brand: z.string().trim().optional(),
    location: z.string().trim(),
    eventPosterName: z.string().trim().optional(),
    // negotiable: z.enum(['yes', 'no']).optional(),
    // warranty: z.string().optional(),
    contactNumber: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updateListingValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    price: z.number().optional(),
    date: z.coerce.date().optional(),
    // condition: z.enum(['new', 'likeNew', 'used', 'refurbished']).optional(),
    images: z.array(z.string()).optional(),
    userID: z.string().optional(),
    status: z.enum(['available', 'sold']).default('sold'),
    category: z
      .enum([
        'wedding',
        'birthday',
        'corporate',
        'concert',
        'conference',
        'festival',
        'babyShower',
        'engagement',
        'anniversary',
        'productLaunch',
      ])
      .optional(),
    // brand: z.string().trim().optional(),
    location: z.string().trim().optional(),
    eventPosterName: z.string().trim().optional(),
    // negotiable: z.enum(['yes', 'no']).optional(),
    // warranty: z.string().optional(),
    contactNumber: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

export const ListingValidationSchema = {
  createListingValidationSchema,
  updateListingValidationSchema,
};
