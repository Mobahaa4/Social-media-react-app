import React, { useContext } from "react";

import { useQuery } from "@tanstack/react-query";
import { authContext } from "../Context/AuthContextProvider";
import axios from "axios";
import PostLoading from "../post/PostLoading";
import CommentPost from "../post/CommentPost";

export default function CommentData( {id, commentlimit}) {
    const { token } = useContext(authContext);
  // const [posts, setposts] = useState(null)
  // const [Loading, setLoading] = useState(true)

  // async function getAllPosts(){

  // try {
  //     let {data} = await axios.get("https://linked-posts.routemisr.com/posts?limit=50",{
  //         headers : {
  //             token : token
  //         }
  //     })

  //     setPosts(data.posts)                                               (Any commented code is the the code without useQuery but that doesn't mean it is not true)
  //     setLoading(false)

  // }

  // catch (error) {
  //     console.log(error)
  // }

  // }
  // useEffect( function() {
  //     getAllPosts()
  // }, [] )

  async function getComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
      {
        //the function must return a promise
        headers: {
          //token : token
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: getComments,
    queryKey: ["comments", id],
  });

  
  if (isLoading) {
    return <PostLoading />;
  }
  if (isError) {
    return <h1>There is an Error</h1>;
  }

  return (
    <>
      {data.data.data.comments.slice(0, commentlimit).map((comment) => (
        <CommentPost postId={id} key={comment._id} comment={comment} />
      ))}
    </>
  );
}
