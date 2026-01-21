-- Migration: Add idToken column to account table
-- This migration adds the idToken field required for OAuth authentication (Google, GitHub, etc.)

ALTER TABLE "account" ADD COLUMN "idToken" text;
