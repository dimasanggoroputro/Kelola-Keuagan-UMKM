// src/lib/auth.js
import { supabase } from "./supabase";

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
  if (error) throw error;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
};