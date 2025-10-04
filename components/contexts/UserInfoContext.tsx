"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { userAPI, type UserInfo } from "@/lib/api/user";
import { useAppSelector } from "@/lib/redux/hooks";

interface UserInfoContextValue {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  refreshUserInfo: (options?: { silent?: boolean }) => Promise<UserInfo | null>;
}

const UserInfoContext = createContext<UserInfoContextValue | undefined>(
  undefined,
);

const normalizeAvatar = (avatar?: string | null) => {
  if (!avatar) {
    return "";
  }

  if (avatar.startsWith("data:")) {
    return avatar;
  }

  if (avatar.startsWith("http")) {
    return avatar;
  }

  return `data:image/png;base64,${avatar}`;
};

export const UserInfoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const persistUserSnapshot = useCallback((info: UserInfo) => {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot = {
      id: info.id,
      name: info.name,
      email: info.email,
      role: typeof info.role === "string" ? info.role : "user",
    };

    try {
      window.localStorage.setItem("user", JSON.stringify(snapshot));
    } catch (storageError) {
      console.error("Failed to persist user snapshot:", storageError);
    }
  }, []);

  const fetchUserInfo = useCallback(
    async (silent = false): Promise<UserInfo | null> => {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await userAPI.getUserInfo();
        const info = {
          ...response.data,
          avatar: normalizeAvatar(response.data?.avatar as string | undefined),
        } as UserInfo;

        if (!isMountedRef.current) {
          return null;
        }

        setUserInfo(info);
        persistUserSnapshot(info);
        return info;
      } catch (err) {
        if (!isMountedRef.current) {
          return null;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your profile information.",
        );
        return null;
      } finally {
        if (!silent && isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [persistUserSnapshot],
  );

  useEffect(() => {
    const hasToken =
      typeof window !== "undefined"
        ? Boolean(window.localStorage.getItem("_aT"))
        : false;

    if (!isAuthenticated && !hasToken) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    fetchUserInfo(false).catch((error) => {
      console.error("Failed to fetch user info:", error);
    });
  }, [fetchUserInfo, isAuthenticated]);

  const refreshUserInfo = useCallback(
    async (options?: { silent?: boolean }) => {
      return fetchUserInfo(options?.silent ?? true);
    },
    [fetchUserInfo],
  );

  const value = useMemo<UserInfoContextValue>(
    () => ({
      userInfo,
      loading,
      error,
      refreshUserInfo,
    }),
    [error, loading, refreshUserInfo, userInfo],
  );

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
};
