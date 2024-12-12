import { auth } from "@/auth";


export default async function Home() {
  const session = await auth();

  if (session) {
    console.log(session);
  }

  return (
    <div>CRM</div>
  );
}

export const dynamic = 'force-dynamic';