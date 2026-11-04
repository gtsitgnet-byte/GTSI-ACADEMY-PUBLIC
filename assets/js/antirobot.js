window.gtsiPow = async function (api) {
  const r = await fetch(api, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "challenge" }) });
  const d = await r.json();
  if (!d.ok) throw new Error("challenge");
  const enc = new TextEncoder();
  for (let n = 0; ; n++) {
    const h = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(d.c + ":" + n)));
    if (h[0] === 0 && h[1] < 4) return { pow_c: d.c, pow_n: String(n) };
  }
};
