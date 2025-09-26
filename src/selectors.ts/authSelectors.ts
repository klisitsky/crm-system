import { getAsyncRequestData, type AsyncParticle } from "../utils";
import { createSelector } from "reselect";
import type { InitialStateData } from "@/pages/AuthPage/AuthSlice";
import type { RootState } from "../redux";

const selectAuthState = (state: RootState): AsyncParticle<InitialStateData> => state.auth;

export const selectAuthRequestData = createSelector(
  selectAuthState,
  (authParticle: AsyncParticle<InitialStateData>) => getAsyncRequestData(authParticle)
);
