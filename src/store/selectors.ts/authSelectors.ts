import { getAsyncRequestData, type AsyncParticle } from "@store//utils";
import { createSelector } from "reselect";
import type { InitialStateData } from "@/pages/AuthPage/AuthSlice";
import type { RootState } from "@/store/redux";

const selectAuthState = (state: RootState): AsyncParticle<InitialStateData> => state.auth;

export const selectAuthRequestData = createSelector(
  selectAuthState,
  (authParticle: AsyncParticle<InitialStateData>) => getAsyncRequestData(authParticle)
);
