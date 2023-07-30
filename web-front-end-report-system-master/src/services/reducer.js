export const initialState = {
    user: null,
    jwt: null
};

export const actionTypes = {
    SET_USER: "SET_USER",
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
                jwt: action.jwt
            };
        default:
            return state;
    }
};

export default reducer;