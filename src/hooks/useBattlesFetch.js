import { useState, useEffect } from 'react';
import { getBattles } from "../service/mainService";

const initialState = {
    results: [],
};

export const useBattlesFetch = () => {
    const [battles, setBattles] = useState(initialState);
    const [loading, setLoading] = useState(false)

    const battlesAPI = getBattles();
    console.log(battlesAPI);
    const fetchBattles = async () => {
        try {
            setLoading(true)


            setBattles(() => ({
                ...battlesAPI,
                results: battlesAPI,
            }));

        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchBattles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { battles, loading }
}