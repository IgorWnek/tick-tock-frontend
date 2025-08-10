import { authMutations } from './auth/auth.mutations';
import { timeLogsMutations } from './timeLogs/timeLogs.mutations';

export const mutations = {
  ...authMutations,
  ...timeLogsMutations,
  // API_COLLECTION_MUTATIONS
} as const;

export type AxiosMutationsType = typeof mutations;
