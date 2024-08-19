import { useFetch } from "@/hooks/useFetch";
import { IReview } from "@/types/products/product";
import { useProductState } from "@/zustand/product";
import { StarIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
// import { CommentCount } from "disqus-react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const Ratings = () => {
    const [id, name] = useProductState(state => [state.product?.id, state.product?.name]);
    const [cache, setCache] = useState(0);
    const { data: reviews }: { data: Array<{ status: 'error' | 'valid', description: string, items?: Array<IReview>, average?: number }> | null | undefined } = useFetch('/api/product/get-reviews?product=' + id + '&c=' + cache );
    const [userRating, setUserRating] = useState<number | null>(null); // State to manage user's selected rating

    // Function to handle user rating selection
    const handleRatingSelect = (rating: number) => {
        // Trigger any necessary actions here, e.g., sending rating to the server
        console.log('Selected rating:', rating);
        fetch('/api/product/rate?product_id=' + id + '&rating=' + rating).then(() => setCache(Math.random()));
        setUserRating(rating);
    }; return (
        <div className="mt-6">
            <h3 className="sr-only">Reviews</h3>
            <div className="flex items-center">
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <StarIcon
                            key={rating}
                            className={classNames(
                                (userRating || reviews?.average) && (userRating || reviews?.average) >= rating // Check if user has rated or there's an average rating
                                    ? "text-gray-900"
                                    : "text-gray-200",
                                "h-5 w-5 flex-shrink-0 cursor-pointer" // Add cursor pointer for hover effect
                            )}
                            onMouseEnter={() => setUserRating(rating)} // Set rating on hover
                            onMouseLeave={() => setUserRating(null)} // Clear rating on mouse leave
                            onClick={() => handleRatingSelect(rating)} // Handle rating selection on click
                            aria-hidden="true"
                        />
                    ))}
                </div>
                <p className="ml-2">{reviews?.average} out of 5 stars — {reviews?.items?.length ?? 0} review(s)</p>
                {/* <a
                    href={reviews.href}
                    className="ml-3 text-sm font-medium text-[color:var(--primary-color)] hover:text--[color:var(--primary-color-2)]">
                    <CommentCount
                        shortname="3decomstore"
                        config={{
                            url: "https://main.com/" + router.pathname,
                            identifier: product.id,
                            title: product.name,
                        }}>reviews</CommentCount>
                </a> */}
            </div>
        </div>
    );
}