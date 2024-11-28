export const isFavouredByReqUser = (user, data) => {
  if (user && data) {
    // Check in book list
    if (Array.isArray(user.book)) {
      for (let book of user.book) {
        if (data.id === book.id) {
          return true;
        }
      }
    }

    // Check in post list
    if (Array.isArray(user.post)) {
      for (let post of user.post) {
        if (data.id === post.id) {
          return true;
        }
      }
    }

    // Check in comment list
    if (Array.isArray(user.comment)) {
      for (let comment of user.comment) {
        if (data.id === comment.id) {
          return true;
        }
      }
    }
  }

  return false;
};
