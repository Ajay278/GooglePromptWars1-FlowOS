import { z } from 'zod';

/**
 * Data Validation Schemas
 * Used for Firestore sync and internal state validation.
 */

export const FeedbackSchema = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500),
  location: z.string(),
  timestamp: z.any().optional(), // Firestore Timestamp
});

export const CongestionSchema = z.record(z.string(), z.number());

export const LifecycleSchema = z.object({
  status: z.enum(['pre-game', 'live', 'post-game']),
});

export type FeedbackData = z.infer<typeof FeedbackSchema>;
export type LifecycleData = z.infer<typeof LifecycleSchema>;
