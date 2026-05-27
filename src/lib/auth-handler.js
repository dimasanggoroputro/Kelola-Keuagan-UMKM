import { supabase } from "./supabase";

/**
 * Migrates transactions from guest session to authenticated user account.
 * Deduplicates transactions created within a 10-minute window to avoid duplicates.
 */
export const migrateGuestTransactions = async (guestId, authUserId) => {
  if (!guestId || !authUserId) {
    return { success: false, reason: "ID guest atau ID user tidak valid" };
  }

  try {
    // 1. Fetch guest transactions
    const { data: guestTx, error: fetchGuestError } = await supabase
      .from("transactions")
      .select("*")
      .eq("session_id", guestId);

    if (fetchGuestError) throw fetchGuestError;
    if (!guestTx || guestTx.length === 0) {
      return { success: true, migratedCount: 0, duplicateCount: 0 };
    }

    // 2. Fetch authenticated user transactions to check for duplicates
    const { data: userTx, error: fetchUserError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", authUserId);

    if (fetchUserError) throw fetchUserError;

    let migratedCount = 0;
    let duplicateCount = 0;

    for (const tx of guestTx) {
      // Find duplicates by comparing key fields and creation time (within 10 mins)
      const isDuplicate = userTx?.some((utx) => {
        const timeDiff = Math.abs(new Date(utx.created_at) - new Date(tx.created_at));
        return (
          utx.item_name === tx.item_name &&
          utx.amount === tx.amount &&
          utx.type === tx.type &&
          utx.qty === tx.qty &&
          utx.category === tx.category &&
          timeDiff < 10 * 60 * 1000 // 10 minutes
        );
      });

      if (isDuplicate) {
        // Delete duplicate guest transaction
        const { error: delError } = await supabase
          .from("transactions")
          .delete()
          .eq("id", tx.id);
        if (delError) console.error("Error deleting duplicate guest transaction:", delError);
        duplicateCount++;
      } else {
        // Migrate transaction: assign user_id and remove session_id
        const { error: updError } = await supabase
          .from("transactions")
          .update({ user_id: authUserId, session_id: null })
          .eq("id", tx.id);
        
        if (updError) {
          console.error(`Failed to migrate transaction ${tx.id}:`, updError);
        } else {
          migratedCount++;
        }
      }
    }

    return { success: true, migratedCount, duplicateCount };
  } catch (err) {
    console.error("Migration Error:", err);
    return { success: false, error: err.message || "Gagal melakukan migrasi data" };
  }
};
