import { requireChatGPTUser, chatGPTSignOutPath } from '../chatgpt-auth';
export const dynamic='force-dynamic';
export default async function AccountPage(){const user=await requireChatGPTUser('/account');return <main style={{fontFamily:'sans-serif',maxWidth:620,margin:'80px auto',padding:24}}><h1>Pulse account</h1><p>Signed in as <strong>{user.displayName}</strong> ({user.email}).</p><a href="/">Return to messages</a><span> · </span><a href={chatGPTSignOutPath('/')}>Sign out</a></main>}
