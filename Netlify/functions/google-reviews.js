exports.handler = async function () {
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    if (!PLACE_ID || !API_KEY) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "Google Place ID or API key is not configured."
            })
        };
    }

    try {
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${PLACE_ID}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": API_KEY,
                    "X-Goog-FieldMask":
                        "displayName,rating,userRatingCount,reviews,googleMapsUri"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Google API error:", data);

            return {
                statusCode: response.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Function error:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "Unable to load Google Reviews"
            })
        };
    }
};
