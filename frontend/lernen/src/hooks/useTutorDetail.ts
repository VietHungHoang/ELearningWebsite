import { useState, useEffect } from "react";
import { tutorService } from "../services/tutorService";
import type { TutorDetail } from "../types/tutor";

export const useTutorDetail = () => {
    const [tutor, setTutor] = useState<TutorDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tutor detail data
    const fetchTutorDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await tutorService.getTutorProfile();
            if (response.success) {
                setTutor(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to fetch tutor detail data");
            console.error("Error fetching tutor detail:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutorDetail();
    }, []);

    return {
        tutor,
        loading,
        error,
        refetch: fetchTutorDetail,
    };
};