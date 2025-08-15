import { createAction, props } from '@ngrx/store';
import { FullDashboard } from 'app/core/models/dashboard.state.model';
import { Device, LayoutType, SmartItem } from 'app/core/models/models';

export const loadDashboard = createAction(
  '[Dashboard Page] Load Dashboard',
  props<{ dashboardId: string }>(),
);

export const loadDashboardSuccess = createAction(
  '[Dashboard API] Load Dashboard Success',

  props<{ dashboard: FullDashboard }>(),
);

export const loadDashboardFailure = createAction(
  '[Dashboard API] Load Dashboard Failure',
  props<{ error: string }>(),
);

export const enterEditMode = createAction('[Dashboard Page] Enter Edit Mode');
export const exitEditMode = createAction('[Dashboard Page] Exit Edit Mode');
export const saveDashboard = createAction('[Dashboard Page] Save Dashboard');
export const discardChanges = createAction('[Dashboard Page] Discard Changes');

export const addTab = createAction(
  '[Dashboard Edit] Add Tab',
  props<{ title: string }>(),
);
export const removeTab = createAction(
  '[Dashboard Edit] Remove Tab',
  props<{ tabId: string }>(),
);

export const addCard = createAction(
  '[Dashboard Edit] Add Card',

  props<{ tabId: string; layout: LayoutType }>(),
);
export const removeCard = createAction(
  '[Dashboard Edit] Remove Card',
  props<{ tabId: string; cardId: string }>(),
);
export const addItemToCard = createAction(
  '[Dashboard Edit] Add Item To Card',

  props<{ tabId: string; cardId: string; item: SmartItem }>(),
);

export const toggleDeviceState = createAction(
  '[Dashboard UI] Toggle Device State',
  props<{ deviceId: string; state: boolean }>(),
);

export const toggleDeviceStateSuccess = createAction(
  '[Device API] Toggle Device State Success',

  props<{ updatedDevice: Device }>(),
);

export const toggleDeviceStateFailure = createAction(
  '[Device API] Toggle Device State Failure',
  props<{ deviceId: string; previousState: boolean }>(),
);
