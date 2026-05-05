export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    // call OpenAI or your AI API here
    const summary = "Your summarized text here";

    return res.status(200).json({ summary });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}