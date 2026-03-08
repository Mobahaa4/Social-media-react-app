// import axios from 'axios'
// import React, { useContext } from 'react'
// import { authContext } from '../Context/AuthContextProvider'

import { User } from "@heroui/react";

// import PostCard from '../post/PostCard';
// import PostLoading from '../post/PostLoading';
// import { useQuery } from '@tanstack/react-query';
// import CommentPost from '../post/CommentPost';
// import { useParams } from 'react-router-dom';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import axios from "axios";
import { useContext, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { authContext } from "../Context/AuthContextProvider";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";





export default function CommentPost({postId, comment}) {
        let queryClient = useQueryClient()
        const {userId, token} = useContext(authContext)
        const {isOpen, onOpen, onOpenChange} = useDisclosure();
        const commentInput =  useRef(null)

        async function deleteComment() {

        const {data} = await axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(data)

        toast(`${data.message}`,{
                position : "top-right",
        });
        queryClient.invalidateQueries(["comments", postId])

        }


        async function updateComment() {

            const CommentData = {
                    content : commentInput.current.value
            }

            const {data} = await axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, CommentData ,{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
            
            toast(`${data.message}`,{
                position : "top-right"
            });

            console.log(data)
            onOpenChange(false)
            queryClient.invalidateQueries(["comments", postId])
        }

        const CommentDate = new Date (comment.createdAt).toLocaleString("en-us",{
            year : "numeric",
            month : "short",
            day : "numeric",
            hour : "numeric",
            minute : "numeric"
        })

    return (

        <>
        <div className="all-comment w-full flex justify-between  bg-gray-300 rounded-2xl p-3 my-3">

            <div className="comment">
                <User className='my-1'
                avatarProps={{
                    src: comment.commentCreator.photo.endsWith("undefined") ? null : comment.commentCreator.photo,
                }}
                description={CommentDate}
                name={comment.commentCreator.name}
                />
                <p>{comment.content}</p>
            </div> 
            {userId === comment.commentCreator._id ? 
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="light"> <BsThreeDots/> </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="edit" onPress={onOpen}>
                            Edit Comment 
                        </DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger" onClick={deleteComment}>
                    Delete Comment
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown> : ""}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">Comment Edit</ModalHeader>

                        <ModalBody>
                            <textarea ref={commentInput} defaultValue={comment.content} rows={3} className="p-3 border-1 shadow rounded-xl"/>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                            Close
                            </Button>
                            <Button color="primary" onClick={updateComment}>
                            Edit
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                    </ModalContent>
            </Modal>

        </div>


            
        </> 
            )
    
}




