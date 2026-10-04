import { z } from "zod";

export const getPlayerInput = z.object({});

export const getLocationInput = z.object({
    locationId: z.string(),
});

export const getNearbyLocationsInput = z.object({
    locationId: z.string(),
});

export const movePlayerInput = z.object({
    destinationId: z.string(),
});

export const getInventoryInput = z.object({});

export const pickupItemInput = z.object({
    itemId: z.string(),
});

export const dropItemInput = z.object({
    itemId: z.string(),
});