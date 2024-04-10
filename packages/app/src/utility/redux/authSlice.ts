import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
    authToken: string | null;
    username: string | null;
}

const initialState: AuthState = {
    authToken: null,
    username: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken: (state, action: PayloadAction<string>) => {
            state.authToken = action.payload;
        },
        setAuthUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
    },
});

export const {setAuthToken, setAuthUsername} = authSlice.actions;
export default authSlice.reducer;
