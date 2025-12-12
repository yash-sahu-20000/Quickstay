
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const BOOKING_SUCCESS = 'BOOKING_SUCCESS'
export const BOOKING_CANCELLED = 'BOOKING_CANCELLED'
export const BOOKING_FAILED = 'BOOKING_FAILED'

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
};


const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        loading: true,
        ...state
      };

    case LOGIN_SUCCESS:
        return {
            user: action.payload,
            loading: false,
            error: null
        }
    case LOGIN_FAILURE:
        return {
            user: null,
            loading: false,
            error: action.payload
        }
    case LOGOUT:
        return{
            user: null,
            loading: false,
            error: null
        }

      case BOOKING_SUCCESS:
        return {
             user: {
              ...state.user,
              bookingDetails:
                action.payload
              
             },
             loading: false,
             error: null

        }
      case BOOKING_CANCELLED:
        return {
             user: {
              ...state.user,
              bookingDetails:
                action.payload
              
             },
             loading: false,
             error: null

        }
      case BOOKING_FAILED:
        return {
             user: {...state.user},
             loading: false,
             error: action.payload

        }
    
    
    default:
      return state;
  }
};

export default authReducer;


export const loginStart = (payload) => ({
  type: LOGIN_START,
  payload,
});
export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});
export const loginFailure = (payload) => ({
  type: LOGIN_FAILURE,
  payload,
});
export const logout = () => ({
  type: LOGOUT
});

export const bookingSuccess = (payload) => ({
  type: BOOKING_SUCCESS,
  payload,
});
export const bookingCancelled = (payload) => ({
  type: BOOKING_CANCELLED,
  payload,
});
export const bookingFailed = (payload) => ({
  type: BOOKING_FAILED,
  payload,
});
