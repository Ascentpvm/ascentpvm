import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Check auth on page load and redirect if authed
  const session = await auth();
  const rankCalculatorUrl = '/rank-calculator';
  if (session) {
    redirect(rankCalculatorUrl);
  }

  // Note: Head elements should be placed in layout.tsx or a Client Component using next/head
  return (
    <div
      style={{
        margin: 0,
        backgroundColor: '#0f0f1a',
        color: '#e0e0ff',
        fontFamily: "'Orbitron', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        height: '100vh',
        boxSizing: 'border-box',
        padding: 0,
      }}
    >
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="https://i.imgur.com/07T7lEs.png"
            alt="Ascent Logo"
            style={{
              width: 'auto',
              maxWidth: '90vw',
              maxHeight: '18vh',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto 10px auto',
            }}
          />
          <p style={{ margin: 0 }}>The Premier Endgame Ironman Clan</p>
        </header>

        <div
          className="buttons"
          style={{
            display: 'flex',
            gap: 20,
            marginBottom: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a
            href="https://discord.gg/5r5K2ZHkrW"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#9b59ff',
              color: 'white',
              padding: '15px 25px',
              textDecoration: 'none',
              borderRadius: 10,
              boxShadow: '0 0 10px #9b59ff',
              transition: 'background-color 0.3s ease',
              marginRight: 0,
            }}
          >
            Join Discord
          </a>
          <a
            href="https://templeosrs.com/groups/overview.php?id=3230"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#9b59ff',
              color: 'white',
              padding: '15px 25px',
              textDecoration: 'none',
              borderRadius: 10,
              boxShadow: '0 0 10px #9b59ff',
              transition: 'background-color 0.3s ease',
              marginRight: 0,
            }}
          >
            View Temple Page
          </a>
          <a
            href="#"
            style={{
              backgroundColor: '#9b59ff',
              color: 'white',
              padding: '15px 25px',
              textDecoration: 'none',
              borderRadius: 10,
              boxShadow: '0 0 10px #9b59ff',
              transition: 'background-color 0.3s ease',
              marginRight: 0,
            }}
          >
            Applications Coming Soon
          </a>
        </div>

        <div
          className="requirements"
          style={{
            maxWidth: 700,
            background: '#1a1a2e',
            padding: 30,
            borderRadius: 12,
            boxShadow: '0 0 15px rgba(155, 89, 255, 0.3)',
          }}
        >
          <h2 style={{ color: '#9b59ff', marginBottom: 15 }}>Clan Requirements</h2>
          <ul style={{ listStyleType: 'square', paddingLeft: 20, margin: 0 }}>
            <li>100 Theatre of Blood KC</li>
            <li>100 Expert Tombs of Amascut</li>
            <li>25 Challenge Mode Chambers of Xeric</li>
            <li>95 Slayer</li>
            <li>Avernic Defender Hilt</li>
            <li>
              Elder Maul <strong>OR</strong> Dragon Warhammer
            </li>
            <li>Infernal Cape</li>
            <li>Dizana's Quiver</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
