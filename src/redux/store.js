import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./auth/auth.reducer";
import { userReducer } from "./user/user.reducer";
import { bookReducer } from "./book/book.reducer";
import { categoryReducer } from "./category/category.reducer";
import { tagReducer } from "./tag/tag.reducer";
import { chapterReducer } from "./chapter/chapter.reducer";
import { commentReducer } from "./comment/comment.reducer";
import creditPackageReducer from "./creditpackage/creditpackage.reducer";
import { notificationReducer } from "./notification/notification.reducer";
import { chatReducer } from "./chat/chat.reducer";
import { postReducer } from "./post/post.reducer";
import { reportReducer } from "./report/report.reducer";
import purchaseReducer from "./purchase/purchase.reducer";
import authorReducer from "./author/author.reducer";
import adminPayoutReducer from "./adminPayout/adminPayout.reducer";

const rootReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  book: bookReducer,
  chapter: chapterReducer,
  comment: commentReducer,
  category: categoryReducer,
  tag: tagReducer,
  creditpackage: creditPackageReducer,
  post: postReducer,
  chat: chatReducer,
  notification: notificationReducer,
  report: reportReducer,
  purchase: purchaseReducer,
  author: authorReducer,
  adminPayout: adminPayoutReducer,
});
export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
