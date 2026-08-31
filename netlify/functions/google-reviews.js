exports.handler = async function () {
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    // Check Netlify environment variables
    if (!PLACE_ID || !API_KEY) {
        console.error("Missing Google environment variables:", {
            hasPlaceId: !!PLACE_ID,
            hasApiKey: !!API_KEY
        });

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

        // Log Google's actual response
        console.log("Google Places API status:", response.status);
        console.log(
            "Google Places API response:",
            JSON.stringify(data)
        );

        if (!response.ok) {
            return {
                statusCode: response.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "Google Places API request failed.",
                    googleStatus: response.status,
                    googleResponse: data
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Netlify Function error:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "Unable to load Google Reviews.",
                details: error.message
            })
        };
    }
};
