import { beforeEach, describe, expect, it } from 'vitest';

import { useModalStore } from '@/stores/modal-store';

describe('modal-store', () => {
  beforeEach(() => {
    useModalStore.setState(useModalStore.getInitialState());
  });

  it('opens and closes alert modals as a stack', () => {
    useModalStore
      .getState()
      .openModal({ alert: '첫 번째 모달', title: '알림' });
    useModalStore
      .getState()
      .openModal({ alert: '두 번째 모달', title: '추가 알림' });

    expect(useModalStore.getState().modalCount()).toBe(2);
    expect(useModalStore.getState().modals.at(-1)?.title).toBe('추가 알림');

    useModalStore.getState().closeModal();

    expect(useModalStore.getState().modalCount()).toBe(1);
    expect(useModalStore.getState().modals[0]?.title).toBe('알림');
  });

  it('supports shorthand string modals', () => {
    useModalStore.getState().openModal('문자열 모달');

    expect(useModalStore.getState().modalCount()).toBe(1);
    expect(useModalStore.getState().modals[0]).toMatchObject({
      alert: '문자열 모달',
      size: 'sm',
    });
  });

  it('applies hideBottomButton to alert object inputs too', () => {
    useModalStore.getState().openModal({ alert: '버튼 감춤' }, true);

    expect(useModalStore.getState().modals[0]).toMatchObject({
      alert: '버튼 감춤',
      hideBottomButton: true,
    });
  });

  it('closes all modals at once', () => {
    useModalStore.getState().openModal({ alert: '하나' });
    useModalStore.getState().openModal({ alert: '둘' });

    useModalStore.getState().closeAllModals();

    expect(useModalStore.getState().modalCount()).toBe(0);
  });
});
