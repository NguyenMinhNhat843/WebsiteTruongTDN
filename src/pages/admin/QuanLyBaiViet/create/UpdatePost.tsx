import { useParams } from "react-router-dom";
import CreatePost from "./CreatePost";
import { $api } from "../../../../api/client";
import { SpinnerLoading } from "../../../../components/ui/SpinnerLoading";

const UpdatePost = () => {
  const postId = useParams().id;

  const { data: postData, isLoading } = $api.useQuery(
    "get",
    "/posts/{id}",
    {
      params: {
        path: {
          id: Number(postId),
        },
      },
    },
    {
      enabled: !!postId,
    },
  );

  if (isLoading) {
    return <SpinnerLoading />;
  }

  return (
    <div>
      <CreatePost defaultValues={postData} />
    </div>
  );
};

export default UpdatePost;
