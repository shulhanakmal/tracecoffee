/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

export default async function (req, res) {
    var postData = {
        grant_type: `${process.env.GRANT_TYPE}`,
        client_id: `${process.env.CLIENT_ID}`,
        scope : '*',
        client_secret : `${process.env.CLIENT_SECRET}`
    };
    
    return await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_URL_API}/oauth/token`,
        headers: {
            "Content-Type": `application/json`,
            "Accept": `application/json`,
        },
        data: postData
    }).then(async (response) => {
        return res.status(200).end(JSON.stringify(response.data));
    }, (error) => {
        if(error.response) {
            return res.status(400).end(JSON.stringify(error.response.data));
        } else {
            return res.status(400).end(JSON.stringify(error.message));
        }
    });
}