const fetchKeys = async (): Promise<Array<Key>> => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  const data: GoogleResponse = await response.json();
  return data.keys.map(key => ({
    kid: toBytes32(key.kid),
    n: toBytes(key.n),
    e: toBytes(key.e)
  }));
}

interface Key {
  kid: string;  // Key ID (as bytes32)
  n: string;    // RSA modulus (as bytes)
  e: string;    // RSA exponent (as bytes)
}

const toBytes32 = (str: string): string => {
  return `0x${str.padStart(64, '0')}`;
}

const toBytes = (str: string): string => {
  return `0x${Buffer.from(str, 'base64url').toString('hex')}`;
}

interface GoogleResponse {
  keys: Array<KeyResponse>
}

interface KeyResponse {
  "kid": string;
  "n": string;
  "e": string;
}

const main = async () => {
  const keys = await fetchKeys();

  console.log(keys);

  setTimeout(main, 1000);
}

main();