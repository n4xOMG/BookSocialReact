export const isFavouredByReqUser = (user, data) => {
  if (user) {
    // Check in book list
    for (let book of user.book) {
      if (data.id === book.id) {
        return true;
      }
    }

    // Check in comment list
    for (let comment of user.comment) {
      if (data.id === comment.id) {
        return true;
      }
    }
  }

  return false;
};
