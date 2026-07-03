"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite/client";

export function AppwritePing() {
  useEffect(() => {
    client.ping();
  }, []);

  return null;
}
