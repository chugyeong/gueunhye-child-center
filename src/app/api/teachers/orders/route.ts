import { getAdminMutationErrorMessage, getAdminMutationSupabaseClient } from "@/lib/admin-auth";
import type { Teacher } from "@/types/teacher";

type OrderItem = {
  id: number;
  display_order: number;
};

export async function PATCH(request: Request) {
  try {
    const adminSupabase = await getAdminMutationSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const items = parseOrderItems(await request.json());

    for (const item of items) {
      const { error } = await adminSupabase
        .from("teachers")
        .update({ display_order: item.display_order })
        .eq("id", item.id);

      if (error) {
        throw error;
      }
    }

    const { data, error } = await adminSupabase
      .from("teachers")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json((data ?? []) as Teacher[]);
  } catch (error) {
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "선생님 순서를 저장하지 못했습니다.") },
      { status: 400 },
    );
  }
}

function parseOrderItems(body: unknown) {
  if (!body || typeof body !== "object" || !("items" in body)) {
    throw new Error("순서 정보가 올바르지 않습니다.");
  }

  const items = (body as { items?: unknown }).items;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("순서 정보가 없습니다.");
  }

  const seenIds = new Set<number>();
  const seenOrders = new Set<number>();

  return items.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("순서 정보가 올바르지 않습니다.");
    }

    const value = item as Record<string, unknown>;
    const id = Number(value.id);
    const displayOrder = Number(value.display_order);

    if (!Number.isInteger(id) || id < 1 || !Number.isInteger(displayOrder) || displayOrder < 1) {
      throw new Error("순서 정보가 올바르지 않습니다.");
    }

    if (seenIds.has(id) || seenOrders.has(displayOrder)) {
      throw new Error("순서 정보가 중복되었습니다.");
    }

    seenIds.add(id);
    seenOrders.add(displayOrder);

    return {
      id,
      display_order: displayOrder,
    } satisfies OrderItem;
  });
}
