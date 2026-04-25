import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      currency: true,
      monthlyIncome: true,
      avatarColor: true,
      onboarded: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const allowed = ["name", "currency", "monthlyIncome", "avatarColor", "onboarded"];
  const data: Record<string, unknown> = {};
  allowed.forEach((key) => {
    if (key in body) data[key] = body[key];
  });

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      currency: true,
      monthlyIncome: true,
      avatarColor: true,
      onboarded: true,
    },
  });

  return NextResponse.json({ user });
}
