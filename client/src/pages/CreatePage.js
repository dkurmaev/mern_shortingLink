import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";


export const CreatePage = () => {
    const history = useNavigate()
    const auth = useContext(AuthContext)
    const {request} = useHttp()
    const [link, setLink] = useState('')

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
               const data =  await request('/api/link/generate', 'POST', {from: link},
                   {Authorization: `Bearer ${auth.token}`})
                history(`/detail/${data.link._id}`)
            }catch(e) { }
        }
    }

    return (
        <div className="row">
            <div className="cols8 offset-s2" style={{ paddingTop: '2rem' }}>
                <div className="input-field">
                    <input
                        placeholder="Please input your link"
                        id="link"
                        type="text"
                        value={link}
                        onChange={event => setLink(event.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Please input your link </label>
                </div>
            </div>

        </div>
    )
}

