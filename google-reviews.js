exports.handler = async function () {

    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    try {

        const response = await fetch(
            `https://places.googleapis.com/v1/places/${PLACE_ID}`,
            {
                headers: {
                    "Content-Type": "application/json",

                    "X-Goog-Api-Key": API_KEY,

                    "X-Goog-FieldMask":
                        "displayName,rating,userRatingCount,reviews,googleMapsUri"
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                `Google API Error: ${response.status}`
            );

        }

        const data = await response.json();

        return {
            statusCode: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        };

    } catch (error) {

        console.error(
            "Google Reviews Error:",
            error
        );

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