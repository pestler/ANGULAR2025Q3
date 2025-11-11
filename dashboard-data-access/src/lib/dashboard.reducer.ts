import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

import { FullDashboard } from '@core/models/dashboard.state.model';
import { SmartCard } from '@core/models/models';

export interface SelectedDashboardState {
  dashboard: FullDashboard | null;
  originalDashboard: FullDashboard | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: SelectedDashboardState = {
  dashboard: null,
  originalDashboard: null,
  isLoading: false,
  error: null,
};

function moveItemInArray<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const newArr = [...arr];
  const [item] = newArr.splice(fromIndex, 1);
  newArr.splice(toIndex, 0, item);
  return newArr;
}

export const dashboardReducer = createReducer(
  initialState,

  on(DashboardActions.loadDashboard, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardSuccess, (state, { dashboard }) => ({
    ...state,
    isLoading: false,
    dashboard: dashboard,
    originalDashboard: JSON.parse(JSON.stringify(dashboard)),
  })),

  on(DashboardActions.loadDashboardFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(DashboardActions.discardChanges, (state) => ({
    ...state,
    dashboard: state.originalDashboard
      ? JSON.parse(JSON.stringify(state.originalDashboard))
      : null,
  })),

  on(DashboardActions.exitEditMode, (state) => ({
    ...state,
    originalDashboard: state.dashboard
      ? JSON.parse(JSON.stringify(state.dashboard))
      : null,
  })),

  on(DashboardActions.addTab, (state, { title }) => {
    if (!state.dashboard) {
      return state;
    }
    const newTabId = title.toLowerCase().replace(/\s+/g, '-');
    const newTab = { id: newTabId, title, cards: [] };

    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: [...state.dashboard.tabs, newTab],
      },
    };
  }),

  on(DashboardActions.removeTab, (state, { tabId }) => {
    if (!state.dashboard) {
      return state;
    }
    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.filter((tab) => tab.id !== tabId),
      },
    };
  }),

  on(DashboardActions.updateDashboardTitle, (state, { title }) => {
    if (!state.dashboard) {
      return state;
    }
    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        title: title,
      },
    };
  }),

  on(DashboardActions.updateTabTitle, (state, { tabId, newTitle }) => {
    if (!state.dashboard) {
      return state;
    }
    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.map((tab) => {
          if (tab.id === tabId) {
            return { ...tab, title: newTitle };
          }
          return tab;
        }),
      },
    };
  }),

  on(DashboardActions.addCard, (state, { tabId, layout }) => {
    if (!state.dashboard) {
      return state;
    }

    const newCard: SmartCard = {
      id: `card-${Date.now()}-${Math.random()}`,
      title: layout,
      layout: layout,
      items: [],
    };

    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.map((tab) => {
          if (tab.id === tabId) {
            return {
              ...tab,
              cards: [...tab.cards, newCard],
            };
          }
          return tab;
        }),
      },
    };
  }),
  on(DashboardActions.removeCard, (state, { tabId, cardId }) => {
    if (!state.dashboard) return state;

    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.map((tab) => {
          if (tab.id === tabId) {
            return {
              ...tab,
              cards: tab.cards.filter((card) => card.id !== cardId),
            };
          }
          return tab;
        }),
      },
    };
  }),

  on(DashboardActions.updateCardTitle, (state, { tabId, cardId, newTitle }) => {
    if (!state.dashboard) return state;

    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.map((tab) => {
          if (tab.id === tabId) {
            return {
              ...tab,
              cards: tab.cards.map((card) => {
                if (card.id === cardId) {
                  return { ...card, title: newTitle };
                }
                return card;
              }),
            };
          }
          return tab;
        }),
      },
    };
  }),

  on(DashboardActions.addItemToCard, (state, { tabId, cardId, item }) => {
    if (!state.dashboard) return state;

    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.map((tab) => {
          if (tab.id === tabId) {
            return {
              ...tab,
              cards: tab.cards.map((card) => {
                if (card.id === cardId) {
                  return {
                    ...card,
                    items: [...card.items, item],
                  };
                }
                return card;
              }),
            };
          }
          return tab;
        }),
      },
    };
  }),

  on(
    DashboardActions.removeItemFromCard,
    (state, { tabId, cardId, itemId }) => {
      if (!state.dashboard) return state;

      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          tabs: state.dashboard.tabs.map((tab) => {
            if (tab.id === tabId) {
              return {
                ...tab,
                cards: tab.cards.map((card) => {
                  if (card.id === cardId) {
                    return {
                      ...card,
                      items: card.items.filter((item) => item.id !== itemId),
                    };
                  }
                  return card;
                }),
              };
            }
            return tab;
          }),
        },
      };
    },
  ),

  on(
    DashboardActions.toggleDeviceState,
    (state, { deviceId, state: newState }) => {
      if (!state.dashboard) {
        return state;
      }
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          tabs: state.dashboard.tabs.map((tab) => ({
            ...tab,
            cards: tab.cards.map((card) => ({
              ...card,
              items: card.items.map((item) => {
                if (item.id === deviceId && item.type === 'device') {
                  return { ...item, state: newState };
                }
                return item;
              }),
            })),
          })),
        },
      };
    },
  ),
  on(
    DashboardActions.toggleDeviceStateFailure,
    (state, { deviceId, previousState }) => {
      if (!state.dashboard) {
        return state;
      }
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          tabs: state.dashboard.tabs.map((tab) => ({
            ...tab,
            cards: tab.cards.map((card) => ({
              ...card,
              items: card.items.map((item) => {
                if (item.id === deviceId && item.type === 'device') {
                  return { ...item, state: previousState };
                }
                return item;
              }),
            })),
          })),
        },
      };
    },
  ),
  on(DashboardActions.reorderTab, (state, { tabId, direction }) => {
    if (!state.dashboard) return state;

    const tabs = state.dashboard.tabs;
    const currentIndex = tabs.findIndex((t) => t.id === tabId);
    const newIndex = currentIndex + (direction === 'left' ? -1 : 1);

    if (newIndex < 0 || newIndex >= tabs.length) {
      return state;
    }

    const reorderedTabs = moveItemInArray(tabs, currentIndex, newIndex);

    return {
      ...state,
      dashboard: { ...state.dashboard, tabs: reorderedTabs },
    };
  }),

  on(DashboardActions.reorderCard, (state, { tabId, cardId, direction }) => {
    if (!state.dashboard) return state;

    return {
      ...state,
      dashboard: {
        ...state.dashboard,
        tabs: state.dashboard.tabs.map((tab) => {
          if (tab.id === tabId) {
            const cards = tab.cards;
            const currentIndex = cards.findIndex((c) => c.id === cardId);
            const newIndex = currentIndex + (direction === 'up' ? -1 : 1);

            if (newIndex < 0 || newIndex >= cards.length) {
              return tab;
            }

            const reorderedCards = moveItemInArray(
              cards,
              currentIndex,
              newIndex,
            );
            return { ...tab, cards: reorderedCards };
          }
          return tab;
        }),
      },
    };
  }),

  on(
    DashboardActions.toggleDeviceGroupState,
    (state, { deviceIds, newState }) => {
      if (!state.dashboard) {
        return state;
      }

      const deviceIdsSet = new Set(deviceIds);

      const newDashboard = {
        ...state.dashboard,

        tabs: state.dashboard.tabs.map((tab) => {
          return {
            ...tab,

            cards: tab.cards.map((card) => {
              return {
                ...card,

                items: card.items.map((item) => {
                  if (item.type === 'device' && deviceIdsSet.has(item.id)) {
                    return { ...item, state: newState };
                  }

                  return item;
                }),
              };
            }),
          };
        }),
      };

      return {
        ...state,
        dashboard: newDashboard,
      };
    },
  ),
);

export const featureKey = 'selectedDashboard';
