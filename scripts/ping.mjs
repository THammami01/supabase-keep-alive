const projects = JSON.parse(process.env.SUPABASE_PROJECTS || "[]");

if (projects.length === 0) {
  console.error("SUPABASE_PROJECTS is empty or not set.");
  process.exit(1);
}

let failed = false;

for (const { name, url, key } of projects) {
  const timestamp = new Date().toISOString();
  try {
    const res = await fetch(`${url}/rest/v1/?limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (res.ok) {
      console.log(`[${timestamp}] ✓ ${name} — ${res.status}`);
    } else {
      const body = await res.text();
      console.error(`[${timestamp}] ✗ ${name} — ${res.status}: ${body}`);
      failed = true;
    }
  } catch (err) {
    console.error(`[${timestamp}] ✗ ${name} — ${err.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);
