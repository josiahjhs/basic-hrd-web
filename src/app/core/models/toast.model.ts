export type ToastType = 'delete' | 'edit' | 'add';

export interface ToastData {
  message: string;
  type: ToastType;
}
