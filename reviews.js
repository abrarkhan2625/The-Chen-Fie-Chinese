async function loadGoogleReviews() {

    const ratingElement =
        document.getElementById("google-rating");

    const reviewsContainer =
        document.getElementById("google-reviews");

    try {

        ratingElement.innerHTML = "Loading Google Reviews...";
        reviewsContainer.innerHTML = "Loading reviews...";

        const response = await fetch(
            "/.netlify/functions/google-reviews"
        );

        const data = await response.json();

        console.log("Website Google Reviews response:", data);

        if (!response.ok) {

            console.error(
                "Google Reviews Function error:",
                data
            );

            throw new Error(
                data?.googleResponse?.error?.message ||
                data?.error ||
                "Unable to load reviews"
            );
        }


        /* =========================
           OVERALL RATING
        ========================= */

        const rating =
            data.rating !== undefined
                ? Number(data.rating).toFixed(1)
                : "N/A";

        const reviewCount =
            data.userRatingCount || 0;


        ratingElement.innerHTML = `
            <div class="rating-number">
                ${rating}
            </div>

            <div class="rating-info">

                <div class="stars">
                    ★★★★★
                </div>

                <p>
                    Based on ${reviewCount} Google Review${reviewCount === 1 ? "" : "s"}
                </p>

            </div>
        `;


        /* =========================
           GOOGLE MAPS LINK
        ========================= */

        if (data.googleMapsUri) {

            const mapsLink =
                document.getElementById("google-maps-link");

            if (mapsLink) {
                mapsLink.href = data.googleMapsUri;
            }
        }


        /* =========================
           REVIEWS
        ========================= */

        reviewsContainer.innerHTML = "";


        if (
            Array.isArray(data.reviews) &&
            data.reviews.length > 0
        ) {

            data.reviews.forEach(review => {

                const author =
                    review.authorAttribution?.displayName ||
                    "Google User";


                const reviewText =
                    review.text?.text ||
                    review.originalText?.text ||
                    "No review text available.";


                const reviewRating =
                    Number(review.rating) || 0;


                const filledStars =
                    "★".repeat(
                        Math.min(5, Math.max(0, Math.round(reviewRating)))
                    );

                const emptyStars =
                    "☆".repeat(
                        5 -
                        Math.min(5, Math.max(0, Math.round(reviewRating)))
                    );


                const stars =
                    filledStars + emptyStars;


                const reviewDate =
                    review.relativePublishTimeDescription ||
                    "";


                const avatarLetter =
                    author.charAt(0).toUpperCase();


                const authorProfile =
                    review.authorAttribution?.uri || "#";


                reviewsContainer.innerHTML += `

                    <div class="review-card">

                        <div class="review-header">

                            <div class="review-avatar">
                                ${avatarLetter}
                            </div>

                            <div>

                                <h3>
                                    ${escapeHtml(author)}
                                </h3>

                                <div class="stars">
                                    ${stars}
                                </div>

                            </div>

                        </div>


                        <p class="review-text">
                            ${escapeHtml(reviewText)}
                        </p>


                        <span class="review-date">
                            ${escapeHtml(reviewDate)}
                        </span>

                        ${
                            authorProfile !== "#"
                            ? `
                                <div style="margin-top:10px;">
                                    <a
                                        href="${escapeAttribute(authorProfile)}"
                                        target="_blank"
                                        rel="noopener"
                                        style="font-size:12px;"
                                    >
                                        Google reviewer
                                    </a>
                                </div>
                            `
                            : ""
                        }

                    </div>

                `;
            });


        } else {

            reviewsContainer.innerHTML =
                "<p>No Google reviews available yet.</p>";
        }


    } catch (error) {

        console.error(
            "Unable to load Google Reviews:",
            error
        );


        ratingElement.innerHTML =
            "Google Reviews";


        reviewsContainer.innerHTML = `
            <div class="review-card">

                <p class="review-text">
                    Unable to load Google reviews at the moment.
                </p>

                <p class="review-date">
                    Please try again later.
                </p>

            </div>
        `;
    }
}


/* =========================
   SECURITY HELPERS
========================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHtml(value);
}


/* =========================
   LOAD REVIEWS
========================= */

loadGoogleReviews();