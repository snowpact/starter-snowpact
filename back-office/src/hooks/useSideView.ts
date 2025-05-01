import { useState } from 'react';

export type SideViewState<T> = {
  display: T | null;
  selectedId: string | null;
  title: string | null;
};

export type SideViewActions<T> = {
  openRequest: (display: T, title: string, selectedId?: string) => void;
  closeRequest: () => void;
};

export const useSideView = <T extends string>(): [SideViewState<T>, SideViewActions<T>] => {
  const [sideViewState, setSideViewState] = useState<SideViewState<T>>({
    display: null,
    selectedId: null,
    title: null,
  });

  const openRequest = (display: T, title: string, selectedId?: string) => {
    setSideViewState({
      display: display,
      selectedId: selectedId ?? null,
      title,
    });
  };

  const closeRequest = () => {
    setSideViewState({
      display: null,
      selectedId: null,
      title: null,
    });
  };

  return [
    sideViewState,
    {
      openRequest,
      closeRequest,
    },
  ];
};
