// api/responses.js  (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }
  try {
    const json =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : (req.body ?? JSON.parse(await req.text()));

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(json)
    });

    const text = await upstream.text();
    res
      .status(upstream.status)
      .setHeader("Content-Type", "application/json")
      .send(text);
  } catch (err) {
    res.status(500).json({ error: "relay_error", detail: String(err) });
  }
}
