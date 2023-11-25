import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinkCard} from "../components/LinkCard";


export const DetailPage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp(null, null)
    const [link, setLink] = useState(null)
    const linkId = useParams().id

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setLink(fetched);
        } catch (e) { }
    }, [request, token, linkId]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                await getLink();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [getLink]);


    if (loading) {
        return  <Loader />
    }

    return (
        <>
            {!loading && link && <LinkCard  link={link}/>}
        </>
    )
}

