export type AuthTab = "login" | "register" | "forgot-password";

export type AuthModalProps = {
  open: boolean;
  initialTab: AuthTab;
  onClose: () => void;
};
