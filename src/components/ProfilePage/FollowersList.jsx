import ConnectionsList from "./ConnectionsList";

const FollowersList = ({ userId }) => {
  return <ConnectionsList userId={userId} variant="followers" />;
};

export default FollowersList;
