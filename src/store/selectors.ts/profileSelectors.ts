import { getAsyncRequestData, type AsyncParticle } from "@/store/utils";
import { createSelector } from "reselect";
import type { Profile } from "@/types/profile";
import type { RootState } from "@store/redux";

const selectProfileState = (state: RootState): AsyncParticle<Profile> => state.profile;

export const selectProfileRequestData = createSelector(
  selectProfileState,
  (profileParticle: AsyncParticle<Profile>) => getAsyncRequestData(profileParticle)
);