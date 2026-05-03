export type AuthTab = "login" | "register";

export type AuthModalProps = {
  open: boolean;
  initialTab: AuthTab;
  onClose: () => void;
};
