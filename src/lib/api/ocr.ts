export const fetchOcr = async (imageUrl: string) => {
    const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({imageUrl}),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch OCR")
    }
    // In fetchOcr function
console.log("fetchOcr is called with:", imageUrl);
    return res.json();
}