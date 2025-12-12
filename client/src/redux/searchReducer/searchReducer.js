import { normalizeDate } from "../../utils/functions";

export const NEW_SEARCH = 'NEW_SEARCH';
export const RESET_SEARCH = 'RESET_SEARCH';

const INITIAL_STATE = {
  city: null,
  date: [{
    startDate: normalizeDate (new Date()),
    endDate: normalizeDate (new Date())
  }],
  persons:{
    adult: 0,
    children: 0,
    room: 0,
  }
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_SEARCH:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_SEARCH:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default searchReducer;


export const newSearch = (payload) => ({
  type: NEW_SEARCH,
  payload,
});

export const resetSearch = () => ({
  type: RESET_SEARCH,
});