import ConnectionsList from "./ConnectionsList";

const FollowingList = ({ userId }) => {
  return <ConnectionsList userId={userId} variant="following" />;
};

export default FollowingList;
