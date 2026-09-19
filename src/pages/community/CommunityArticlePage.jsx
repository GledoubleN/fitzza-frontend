import { useParams } from "react-router-dom";

export const CommunityArticlePage = () => {
  const { id } = useParams();

  return (
    <p>This is Article Page. id: {id}</p>
  )
}
