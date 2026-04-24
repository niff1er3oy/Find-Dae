import { getEventByIdAction, getEventFoundAttendeesAction, checkEventRoleAction, getEventCollaboratorsAction, getEventStatsAction } from "@/app/actions/event";
import { getUserAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ManageEventClient from "./ManageEventClient";

export default async function SingleEventManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserAction();

  if (!user || user.role !== 'photographer') {
    redirect('/dashboard');
  }

  const role = await checkEventRoleAction(id);
  if (role !== 'main_owner' && role !== 'owner') {
    redirect('/events');
  }

  const event = await getEventByIdAction(id);
  if (!event) {
    redirect('/events');
  }

  const [attendees, collaborators, stats] = await Promise.all([
    getEventFoundAttendeesAction(id),
    getEventCollaboratorsAction(id),
    getEventStatsAction(id),
  ]);

  return <ManageEventClient event={event} attendees={attendees} collaborators={collaborators} myRole={role} stats={stats} />;
}
