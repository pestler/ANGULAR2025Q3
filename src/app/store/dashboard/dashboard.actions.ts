import { createAction, props } from '@ngrx/store';
import { FullDashboard } from 'app/core/models/dashboard.state.model';
import { Device, LayoutType, SmartItem, Tab } from 'app/core/models/models';
import { NewDashboardPayload } from 'app/core/models/dashboard.state.model';
import { Dashboard } from 'app/core/models/dashboard.model';

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

export const saveDashboard = createAction(
  '[Dashboard Page] Save Dashboard',
  props<{ dashboardId: string; payload: { tabs: Tab[] } }>(),
);
export const discardChanges = createAction('[Dashboard Page] Discard Changes');

export const deleteDashboard = createAction(
  '[Dashboard Page] Delete Dashboard',
  props<{ dashboardId: string }>(),
);
export const deleteDashboardSuccess = createAction(
  '[Dashboard API] Delete Dashboard Success',
);
export const deleteDashboardFailure = createAction(
  '[Dashboard API] Delete Dashboard Failure',
  props<{ error: string }>(),
);

export const updateDashboardTitle = createAction(
  '[Dashboard Edit] Update Title',
  props<{ title: string }>(),
);

export const addTab = createAction(
  '[Dashboard Edit] Add Tab',
  props<{ title: string }>(),
);
export const removeTab = createAction(
  '[Dashboard Edit] Remove Tab',
  props<{ tabId: string }>(),
);
export const updateTabTitle = createAction(
  '[Dashboard Edit] Update Tab Title',
  props<{ tabId: string; newTitle: string }>(),
);
export const addCard = createAction(
  '[Dashboard Edit] Add Card',
  props<{ tabId: string; layout: LayoutType }>(),
);
export const removeCard = createAction(
  '[Dashboard Edit] Remove Card',
  props<{ tabId: string; cardId: string }>(),
);
export const updateCardTitle = createAction(
  '[Dashboard Edit] Update Card Title',
  props<{ tabId: string; cardId: string; newTitle: string }>(),
);
export const addItemToCard = createAction(
  '[Dashboard Edit] Add Item To Card',
  props<{ tabId: string; cardId: string; item: SmartItem }>(),
);
export const removeItemFromCard = createAction(
  '[Dashboard Edit] Remove Item From Card',
  props<{ tabId: string; cardId: string; itemId: string }>(),
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

export const createDashboard = createAction(
  '[Sidebar] Create Dashboard',
  props<{ payload: NewDashboardPayload }>(),
);

export const createDashboardSuccess = createAction(
  '[Dashboard API] Create Dashboard Success',
  props<{ newDashboard: Dashboard }>(),
);

export const createDashboardFailure = createAction(
  '[Dashboard API] Create Dashboard Failure',
  props<{ error: string }>(),
);
export const reorderTab = createAction(
  '[Dashboard Edit] Reorder Tab',
  props<{ tabId: string; direction: 'left' | 'right' }>(),
);

export const reorderCard = createAction(
  '[Dashboard Edit] Reorder Card',
  props<{ tabId: string; cardId: string; direction: 'up' | 'down' }>(),
);
export const toggleDeviceGroupState = createAction(
  '[Dashboard UI] Toggle Device Group State',
  props<{ deviceIds: string[]; newState: boolean }>(),
);
