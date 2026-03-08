import React, { useContext } from "react";
import { authContext } from "../Context/AuthContextProvider";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostLoading from "../post/PostLoading";
import PostCard from "../post/PostCard";
import { useQuery } from "@tanstack/react-query";
import CommentPost from "../CommentData/CommentData";
import { Helmet } from "react-helmet";
export default function PostData() {
    const { token } = useContext(authContext);
    let { PostId } = useParams();

    async function getPostData() {
        return axios.get(`https://route-posts.routemisr.com/posts/${PostId}`, {
        headers: {
            // token : token
            Authorization: `Bearer ${token}`,
        },
        });
        
    }
    const { data, isLoading, isError } = useQuery({
        queryFn: getPostData, // if I wrote the key "postData" only this means that every post will be with the same key
        queryKey: ["postData", PostId], // so this is not unique and it will show the old post then the new one    (`postData-${PostId}` = ["postData", PostId])
        // so with every new post now with this key it will reloads for the first time because each post is with a unique key
    });
    console.log(data)
    if (isLoading) {
        return <PostLoading />;
    }
    if (isError) {
        return <h1>There is an error</h1>;
    }
    return <>
        <Helmet>
            <title> Post | {data.data.data.post.user.name} </title>
        </Helmet>

        <PostCard post={data.data.data.post} />
    </>;
}
