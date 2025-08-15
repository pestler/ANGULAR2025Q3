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

export const selectDashboardTitle = createSelector(
  selectCurrentDashboard,
  (dashboard) => dashboard?.title ?? '',
);

export const selectDashboardTabs = createSelector(
  selectCurrentDashboard,
  (dashboard) => dashboard?.tabs ?? [],
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectCardsByTabId = (tabId: string) =>
  createSelector(selectDashboardTabs, (tabs) => {
    const foundTab = tabs.find((tab) => tab.id === tabId);
    return foundTab?.cards ?? [];
  });
