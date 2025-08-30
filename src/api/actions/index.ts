import { authMutations } from './auth/auth.mutations';
import { profileMutations } from './auth/profile.mutations';
import { timeLogsMutations } from './timeLogs/timeLogs.mutations';

export const mutations = {
  ...authMutations,
  ...profileMutations,
  ...timeLogsMutations,
  // API_COLLECTION_MUTATIONS
} as const;

export type AxiosMutationsType = typeof mutations;
