export async function getVideoFormats(url: string) {
  const res = await fetch("http://localhost:8000/api/formats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  return res.json();
}
