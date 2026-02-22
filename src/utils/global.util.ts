export function scrollToSection(
  section: string,
) {
  const el = document.getElementById(section);
  if (el) {
    const topOffset = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: topOffset - 100,
      behavior: "smooth",
    });
  }
}

import { sha256 } from 'js-sha256';

function generatePKCE() {
  const codeVerifier = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
  
  const hashBuffer = sha256.arrayBuffer(codeVerifier);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return { codeVerifier, codeChallenge };
}

export function getRegistrationUrl() {
  const { codeChallenge } = generatePKCE();

  const params = new URLSearchParams({
    client_id: 'chariot-app',
    redirect_uri: process.env.NEXT_PUBLIC_CHARIOT_URL!,
    response_type: 'code',
    scope: 'openid',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}registrations?${params}`;
}