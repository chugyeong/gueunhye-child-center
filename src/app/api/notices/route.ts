import { getSortedNotices } from "@/lib/notices";

export async function GET() {
  return Response.json(getSortedNotices());
}
