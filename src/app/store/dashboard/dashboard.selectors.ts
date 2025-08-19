/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, SelectedDashboardState } from './dashboard.reducer';

export const selectDashboardFeature =
  createFeatureSelector<SelectedDashboardState>(featureKey);

export const selectIsLoading = createSelector(
  selectDashboardFeature,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  selectDashboardFeature,
  (state) => state.error,
);

export const selectCurrentDashboard = createSelector(
  selectDashboardFeature,
  (state) => state.dashboard,
);

export const selectOriginalDashboard = createSelector(
  selectDashboardFeature,
  (state) => state.originalDashboard,
);

export const selectDashboardTitle = createSelector(
  selectCurrentDashboard,
  (dashboard) => dashboard?.title ?? '',
);

export const selectDashboardTabs = createSelector(
  selectCurrentDashboard,
  (dashboard) => dashboard?.tabs ?? [],
);

export const selectCardsByTabId = (tabId: string) =>
  createSelector(selectDashboardTabs, (tabs) => {
    const foundTab = tabs.find((tab) => tab.id === tabId);
    return foundTab?.cards ?? [];
  });

export const selectCardById = (tabId: string, cardId: string) =>
  createSelector(selectCardsByTabId(tabId), (cards) =>
    cards.find((card) => card.id === cardId),
  );
