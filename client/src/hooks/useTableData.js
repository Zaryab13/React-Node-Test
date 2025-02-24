import React, { useState, useEffect } from 'react';
import { getApi } from '../services/api';

const useTableData = (apiEndpoint) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getApi(apiEndpoint);
            // Ensure data is an array
            setData(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching table data:', error);
            setError(error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiEndpoint]);

    return { data, isLoading, error, refetch: fetchData };
};

export default useTableData; 