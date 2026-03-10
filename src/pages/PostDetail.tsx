import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { slug } = useParams();
  return <div>{slug}</div>;
};

export default PostDetail;
