import { requireAdmin } from "@/lib/accounting/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSettings, toPendingInvites } from "@/lib/accounting/settings";
import { StaffManager, SettingsForm } from "@/components/accountant/SettingsClient";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await requireAdmin();
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired />;

  const [{ data: staff }, { data: invitesRaw }, settings] = await Promise.all([
    admin.from("app_users").select("id, email, full_name, role, can_edit_financials").order("role"),
    admin.from("accountant_invitations").select("id, email, role, status, expires_at").eq("status", "pending").order("created_at", { ascending: false }),
    getSettings(admin),
  ]);

  const invites = toPendingInvites(invitesRaw ?? []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Settings</h1>
        <p className="mt-1 text-sm text-[#1a1a2e]/55">Administrator controls for access and financial configuration.</p>
      </div>

      <StaffManager
        staff={(staff ?? []) as never}
        invites={invites}
        selfId={me.id}
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
