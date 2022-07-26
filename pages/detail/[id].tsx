import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore';
import LikeButton from '../../components/LikeButton';
import Comments from '../../components/Comments';



interface IProps {
  postDetails: Video;
}


const Detail = ({postDetails}:IProps) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();
  const [comment, setComment] = useState<string>('');
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);;



  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like
      });
      setPost({ ...post, likes: data.likes });
    }
  } ;

  const addComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (userProfile && comment ) {
      
        setIsPostingComment(true);
        const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
          userId: userProfile._id,
          comment,
        });
        setPost({ ...post, comments: data.comments });
        setComment('');
        setIsPostingComment(false);
    }
  };



  if(!post) return null;

  return (
    <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className='relative flex-2 w-[80vh] h-[100vh] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center'>
        <div className='opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
          <p className='cursor-pointer ' onClick={() => router.back()}>
            <MdOutlineCancel className='text-white text-[35px] hover:opacity-90'/>
          </p>
        </div>
        <div className='relative '>
          <div className='flex justify-center items-center w-[80vh] h-[90vh] '>
            <video
            ref={videoRef}
            loop
            controls
            onClick={() => {}}
            src={post.video.asset.url}
            className=' absolute h-full cursor-pointer'
            >

            </video>
          </div>
        </div>
      </div>

      <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
        <div>


          <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded '>
              <div className='ml-4 mt-3 md:w-10 md:h-10 w-16 h-16'>
                <Link href={'/'}>
                  <>
                    <Image
                      width={62}
                      height={62}
                      className=' rounded-full'
                      src={post.postedBy.image}
                      alt='user-profile'
                      layout='responsive'
                    />
                  </>
                </Link>
              </div>
              <div>
                  <Link href={'/'}>
                      <div className='mt-3 flex flex-col gap-2'>
                          <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                          {post.postedBy.userName}{' '}
                          <GoVerified className='text-blue-400 text-md' />
                          </p>
                          <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>
                              {post.postedBy.userName}
                          </p>
                      </div>
                  </Link>
              </div>
            </div>
            
              <div className='pt-5 px-12 '>
                 <p className=' text-md text-gray-600'>{post.caption}</p>
              </div>
            
            <div className='ml-12'>
               {userProfile && (<LikeButton
                  likes={post.likes}
                  flex='flex'
                  handleLike={() => handleLike(true)}
                  handleDislike={() => handleLike(false)}
                />)}
            </div>

            <Comments
                comment={comment}
                setComment={setComment}
                addComment={addComment}
                comments={post.comments}
                isPostingComment={isPostingComment}
              />


        </div>
      </div>

    </div>
  )
}


export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: data },
  };
};


export default Detail