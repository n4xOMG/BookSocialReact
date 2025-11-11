import {
  BOOK_DELETE_FAILED,
  BOOK_DELETE_REQUEST,
  BOOK_DELETE_SUCCEED,
  BOOK_EDIT_FAILED,
  BOOK_EDIT_REQUEST,
  BOOK_EDIT_SUCCEED,
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_AVG_BOOK_RATING_REQUEST,
  GET_AVG_BOOK_RATING_SUCCESS,
  GET_BOOK_COUNT_FAILED,
  GET_BOOK_COUNT_REQUEST,
  GET_BOOK_COUNT_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  GET_BOOKS_BY_AUTHOR_FAILED,
  GET_BOOKS_BY_AUTHOR_SUCCESS,
  GET_FAVOURED_BOOK_FAILED,
  GET_FAVOURED_BOOK_SUCCESS,
  GET_FEATURED_BOOKS_FAILED,
  GET_FEATURED_BOOKS_REQUEST,
  GET_FEATURED_BOOKS_SUCCESS,
  GET_LATEST_UPDATE_BOOK_FAILED,
  GET_LATEST_UPDATE_BOOK_REQUEST,
  GET_LATEST_UPDATE_BOOK_SUCCESS,
  GET_READING_PROGRESSES_BY_BOOK_FAILED,
  GET_READING_PROGRESSES_BY_BOOK_REQUEST,
  GET_READING_PROGRESSES_BY_BOOK_SUCCESS,
  GET_RELATED_BOOKS_FAILED,
  GET_RELATED_BOOKS_REQUEST,
  GET_RELATED_BOOKS_SUCCESS,
  GET_TRENDING_BOOKS_FAILED,
  GET_TRENDING_BOOKS_REQUEST,
  GET_TRENDING_BOOKS_SUCCESS,
  RATING_BOOK_FAILED,
  RATING_BOOK_REQUEST,
  RATING_BOOK_SUCCESS,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
  SET_EDIT_CHOICE_FAILED,
  SET_EDIT_CHOICE_REQUEST,
  SET_EDIT_CHOICE_SUCCESS,
  GET_BOOKS_BY_MONTH_REQUEST,
  GET_BOOKS_BY_MONTH_SUCCESS,
  GET_BOOKS_BY_MONTH_FAILED,
  RESET_BOOK_DETAIL,
  RECORD_BOOK_VIEW_REQUEST,
  RECORD_BOOK_VIEW_SUCCESS,
  RECORD_BOOK_VIEW_FAILED,
} from "./book.actionType";

const initialState = {
  error: null,
  loading: false,
  favoured: null,
  book: null,
  books: [],
  bookCount: 0,
  latestUpdateBooks: [],
  userFavouredBooks: [],
  userFavouredBooksHasMore: true,
  booksByAuthor: [],
  booksByAuthorPage: 0,
  booksByAuthorHasMore: true,
  featuredBooks: [],
  trendingBooks: [],
  searchResults: [],
  relatedBooks: [],
  avgRating: null,
  progresses: [],
  rating: null,
  booksByMonth: [],
  viewError: null,
};

export const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_UPLOAD_REQUEST:
    case BOOK_EDIT_REQUEST:
    case BOOK_DELETE_REQUEST:
    case GET_BOOK_REQUEST:
    case GET_ALL_BOOK_REQUEST:
    case GET_BOOK_COUNT_REQUEST:
    case FOLLOW_BOOK_REQUEST:
    case RATING_BOOK_REQUEST:
    case SEARCH_BOOK_REQUEST:
    case GET_BOOK_RATING_BY_USER_REQUEST:
    case GET_AVG_BOOK_RATING_REQUEST:
    case GET_READING_PROGRESSES_BY_BOOK_REQUEST:
    case GET_LATEST_UPDATE_BOOK_REQUEST:
    case GET_FEATURED_BOOKS_REQUEST:
    case GET_TRENDING_BOOKS_REQUEST:
    case GET_RELATED_BOOKS_REQUEST:
    case SET_EDIT_CHOICE_REQUEST:
    case GET_BOOKS_BY_MONTH_REQUEST:
      return { ...state, loading: true, error: null };
    case RECORD_BOOK_VIEW_REQUEST:
      return { ...state, viewError: null };

    case GET_FEATURED_BOOKS_SUCCESS:
      return { ...state, loading: false, error: null, featuredBooks: action.payload };

    case GET_TRENDING_BOOKS_SUCCESS:
      return { ...state, loading: false, error: null, trendingBooks: action.payload };
    case GET_RELATED_BOOKS_SUCCESS:
      return { ...state, loading: false, relatedBooks: action.payload };
    case GET_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        book: action.payload,
      };
    case BOOK_UPLOAD_SUCCEED:
      return {
        ...state,
        loading: false,
        error: null,
        book: action.payload,
        books: state.books ? [...state.books, action.payload] : [action.payload],
      };

    case BOOK_DELETE_SUCCEED:
      return {
        ...state,
        loading: false,
        error: null,
        books: state.books.filter((book) => book.id !== action.payload),
        booksByAuthor: state.booksByAuthor.filter((book) => book.id !== action.payload),
        trendingBooks: state.trendingBooks.filter((book) => book.id !== action.payload),
        featuredBooks: state.featuredBooks.filter((book) => book.id !== action.payload),
      };
    case BOOK_EDIT_SUCCEED:
    case SET_EDIT_CHOICE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        book: action.payload,
        books: state.books.map((book) => (book.id === action.payload.id ? action.payload : book)),
        booksByAuthor: state.booksByAuthor.map((book) => (book.id === action.payload.id ? action.payload : book)),
        trendingBooks: state.trendingBooks.map((book) => (book.id === action.payload.id ? action.payload : book)),
        featuredBooks: state.featuredBooks.map((book) => (book.id === action.payload.id ? action.payload : book)),
      };
    case GET_LATEST_UPDATE_BOOK_SUCCESS:
      return { ...state, loading: false, latestUpdateBooks: action.payload };
    case FOLLOW_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, favoured: action.payload };
    case GET_ALL_BOOK_SUCCESS:
      // If payload is paginated (Spring style), use .content, else fallback to array
      const booksRes = Array.isArray(action.payload) ? action.payload : action.payload.content || [];
      // If page > 0, append; else, replace
      const page = action.payload.pageable?.pageNumber ?? 0;
      return {
        ...state,
        loading: false,
        error: null,
        books: page > 0 ? [...(state.books || []), ...booksRes] : booksRes,
      };

    case GET_BOOK_RATING_BY_USER_SUCCESS:
    case RATING_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, rating: action.payload };

    case GET_FAVOURED_BOOK_SUCCESS: {
      // Support Spring Page<BookDTO> or array fallback
      const payload = action.payload;
      let content = Array.isArray(payload) ? payload : payload.content || [];
      let page = payload.pageable?.pageNumber ?? 0;
      let last = payload.last ?? true;
      return {
        ...state,
        loading: false,
        userFavouredBooks: page > 0 ? [...(state.userFavouredBooks || []), ...content] : content,
        userFavouredBooksHasMore: !last,
      };
    }

    case GET_AVG_BOOK_RATING_SUCCESS:
      return { ...state, loading: false, error: null, avgRating: action.payload };

    case GET_READING_PROGRESSES_BY_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, progresses: action.payload };

    case GET_BOOK_COUNT_SUCCESS:
      return { ...state, loading: false, error: null, bookCount: action.payload };

    case GET_BOOKS_BY_AUTHOR_SUCCESS: {
      const payload = action.payload?.data ?? action.payload;
      const content = Array.isArray(payload) ? payload : payload?.content || [];
      const pageNumber = payload?.pageable?.pageNumber ?? 0;
      const hasMore = typeof payload?.last === "boolean" ? !payload.last : Array.isArray(payload) ? false : state.booksByAuthorHasMore;

      return {
        ...state,
        loading: false,
        booksByAuthor: pageNumber > 0 ? [...state.booksByAuthor, ...content] : content,
        booksByAuthorPage: pageNumber,
        booksByAuthorHasMore: hasMore,
      };
    }

    case SEARCH_BOOK_SUCCESS:
      return { ...state, loading: false, searchResults: action.payload };

    case GET_BOOKS_BY_MONTH_SUCCESS:
      return { ...state, loading: false, error: null, booksByMonth: action.payload };
    case RECORD_BOOK_VIEW_SUCCESS: {
      const newViewCount = typeof action.payload === "number" ? action.payload : null;
      return {
        ...state,
        viewError: null,
        book:
          state.book && newViewCount !== null
            ? {
                ...state.book,
                viewCount: newViewCount,
              }
            : state.book,
      };
    }

    case RESET_BOOK_DETAIL:
      return {
        ...state,
        book: null,
        rating: null,
        progresses: [],
        relatedBooks: [],
        avgRating: null,
        error: null,
        viewError: null,
      };

    case BOOK_UPLOAD_FAILED:
    case BOOK_EDIT_FAILED:
    case BOOK_DELETE_FAILED:
    case GET_BOOK_FAILED:
    case GET_ALL_BOOK_FAILED:
    case GET_BOOK_COUNT_FAILED:
    case FOLLOW_BOOK_FAILED:
    case RATING_BOOK_FAILED:
    case SEARCH_BOOK_FAILED:
    case GET_READING_PROGRESSES_BY_BOOK_FAILED:
    case GET_LATEST_UPDATE_BOOK_FAILED:
    case GET_FAVOURED_BOOK_FAILED:
    case GET_BOOKS_BY_AUTHOR_FAILED:
    case GET_FEATURED_BOOKS_FAILED:
    case GET_TRENDING_BOOKS_FAILED:
    case SET_EDIT_CHOICE_FAILED:
    case GET_RELATED_BOOKS_FAILED:
    case GET_BOOKS_BY_MONTH_FAILED:
      return { ...state, loading: false, error: action.payload };
    case RECORD_BOOK_VIEW_FAILED:
      return { ...state, viewError: action.payload };

    default:
      return state;
  }
};
