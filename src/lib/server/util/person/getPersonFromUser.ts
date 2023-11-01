import type { User } from "@auth/core/types";
import { getPersonByEmail } from "./getPersonByEmail";

/**
 * Get a person by an associated user
 */

export async function getPersonFromUser(user: User) {
    if (!user.email) return null;
    return await getPersonByEmail(user.email);
}
