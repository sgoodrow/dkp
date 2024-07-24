"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { AccountCircle } from "@mui/icons-material";
import { Skeleton, useTheme } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

export const ProfileIcon: FC<{ size: number }> = ({ size }) => {
  const { data } = trpc.user.get.useQuery();
  const theme = useTheme();
  return data === undefined ? (
    <Skeleton variant="circular" width={size} height={size} />
  ) : data.image === null ? (
    <AccountCircle sx={{ width: size, height: size }} />
  ) : (
    <Image
      style={{
        borderRadius: theme.shape.borderRadius,
      }}
      src={data.image}
      alt="User avatar"
      width={size}
      height={size}
    />
  );
};
