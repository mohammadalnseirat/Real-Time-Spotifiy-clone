import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
//! define the type of the element:
interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  // ! 1-Function To Check Admin Status:
  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/admin//check-admin");
      set({ isAdmin: response.data });
    } catch (error: any) {
      set({ isAdmin: false, error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ! 2-Function To Reset Auth Store:
  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
